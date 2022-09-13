<template>
  <div>
    <BaseDialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </BaseDialog>
    <section>
      <CoachFilter @change-filter="setFilters"/>
    </section>
    <section>
      <BaseCard>
        <div class="controls">
          <BaseButton mode="outline" @click="loadCoachesList(true)">Refresh</BaseButton>
          <BaseButton link to="/auth?redirect=register" v-if="!isAuthenticated">Login to Register as Coach</BaseButton>
          <BaseButton v-if="!isCoach && !isLoading && isAuthenticated" link to="/register">Register as Coach</BaseButton>
        </div>
        <div v-if="isLoading">
          <BaseSpinner />
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          />
        </ul>
        <h3 v-else>No Coaches Found!</h3>
      </BaseCard>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CoachItem from '@/components/coaches/CoachItem.vue';
import CoachFilter from '@/components/coaches/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      isLoading: false,
      error: null,

      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      }
    }
  },
  created() {
    this.loadCoachesList();
  },
  methods: {
    ...mapActions(['loadCoaches']),
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoachesList(refresh = false) {
      this.isLoading = true;
      try {
        await this.loadCoaches({ forceRefresh: refresh });
      } catch (error) {
        this.error = error.message || 'Something went wrong :/';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = false;
    },
  },
  computed: {
    ...mapGetters([
      'coaches',
      'hasCoaches',
      'isCoach',
      'isAuthenticated',
    ]),
    filteredCoaches() {
      return this.coaches.filter(coach => {
        return (this.activeFilters.frontend && coach.areas.includes('frontend')) ||
               (this.activeFilters.backend && coach.areas.includes('backend')) ||
               (this.activeFilters.career && coach.areas.includes('career'))
      });
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>