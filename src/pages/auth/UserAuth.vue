<template>
  <div>
    <BaseDialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </BaseDialog>
    <BaseDialog :show="isLoading" title="Authenticating..." fixed>
      <BaseSpinner />
    </BaseDialog>
    <BaseCard @submit.prevent="submitForm">
      <form>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="email">
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password">
        </div>
        <div class="form-control" v-if="mode !== 'login'">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model.trim="confirmPassword">
        </div>
        <p v-if="!formIsValid">{{ errorMessage }}</p>
        <BaseButton>{{ submitButtonCaption }}</BaseButton>
        <BaseButton type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',

      isLoading: false,
      error: null,
      errorMessage: '',

      formIsValid: true,
      mode: 'login'
    }
  },
  methods: {
    ...mapActions(['signup', 'login']),
    async submitForm() {
      this.formIsValid = true;

      const formOk = this.formIsValidated();
      if(!formOk) {
        this.formIsValid = false
        return;
      }

      this.isLoading = true;

      const userInfo = {
        email: this.email,
        password: this.password,
      };

      try {
        if(this.mode === 'login')
          await this.login(userInfo);
        else
          await this.signup(userInfo);

        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');

        this.$router.replace(redirectUrl);
      } catch (error) {
        this.error = error.message || 'Failed to authenticate!';
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if(this.mode === 'login')
        this.mode = 'signup';
      else
        this.mode = 'login';
    },
    handleError() {
      this.error = null;
    },
    formIsValidated() {
      if(this.email === '' || !this.email.includes('@')) {
        this.errorMessage = 'Invalid email! Please check the informed field.';
        return false;
      }
      if(this.password.length < 6){
        this.errorMessage = 'Invalid password! Please check the informed field.';
        return false;
      }
      if(this.mode === 'signup' && this.password !== this.confirmPassword) {
        this.errorMessage = 'Password and Confirmed Password are not equal!';
        return false;
      }
      return true;
    }
  },
  computed: {
    submitButtonCaption() {
      if(this.mode === 'login')
        return 'Login';
      else
        return 'SignUp';
    },
    switchModeButtonCaption() {
      if(this.mode === 'login')
        return 'SignUp instead';
      else
        return 'Login instead';
    },
  }
}
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input, textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>