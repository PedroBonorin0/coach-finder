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
        <BaseCard>
          <header>
            <h2>Requests Received</h2>
          </header>
          <BaseSpinner v-if="isLoading" />
          <ul v-else-if="hasRequests">
            <RequestItem
              v-for="req in requests"
              :key="req.id"
              :email="req.userEmail"
              :message="req.message"
            />
          </ul>
          <h3 v-else>You haven't received any requets yet :(</h3>
        </BaseCard>
       </section>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import RequestItem from '@/components/requets/RequestItem.vue';

export default {
  data() {
    return {
      isLoading: false,
      error: null,
    }
  },
  components: {
    RequestItem
  },
  created() {
    this.loadRequests();
  },
  methods: {
    ...mapActions(['fetchRequests']),
    async loadRequests() {
      this.isLoading = true;
      try {
        await this.fetchRequests();
      } catch (error) {
        this.error = error.message || 'Something went wrong :/';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  computed: {
    ...mapGetters(['requests', 'hasRequests']),
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>