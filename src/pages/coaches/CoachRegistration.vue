<template>
  <section>
    <BaseCard>
      <h2>Register as a coach now!</h2>
      <CoachForm @save-data="saveData"/>
    </BaseCard>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
  components: {
    CoachForm
  },

  methods: {
    ...mapActions(['registerCoach']),
    saveData(data) {
      this.registerCoach(data);
      
      this.$router.replace('/coaches');
    }
  },
}
</script>