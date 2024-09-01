<script>
import { GithubAuthProvider } from 'firebase/auth'
export const githubAuthProvider = new GithubAuthProvider()
</script>
<script setup>
import { ref, onMounted } from 'vue'
import { getRedirectResult, signInWithPopup } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { FaGithubAlt, FaGoogle, FaMicrosoft, FaApple, FaFacebook } from 'vue3-icons/fa6'

const auth = useFirebaseAuth()

// display errors if any
const error = ref(null)

function handleGithubSignin() {
  signInWithPopup(auth, githubAuthProvider).catch((reason) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}

onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })
})
</script>

<template>
  <main class="flex flex-col h-screen max-w-screen-md mx-auto forest-background">
    <header class="flex flex-col space-y-4 items-start m-12">
      <h1
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600"
      >
        Welcom to DEJA Cloud
      </h1>
      <h2
        class="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-indigo-600"
      >
        Sign in to continue.
      </h2>
    </header>

    <template v-if="error">
      <div class="alert alert-error">
        {{ error.message }}
      </div>
    </template>
    <template v-else>
      <article class="flex flex-col space-y-4 items-start m-12">
        <VaButton
          preset="secondary"
          border-color="primary"
          class="w-64"
          @click="handleGithubSignin"
          block="true"
        >
          <FaGithubAlt class="mr-2" />
          Sign in with GitHub
        </VaButton>
        <VaButton preset="secondary" border-color="primary" class="" block="true" disabled>
          <FaFacebook class="mr-2" />
          Sign in with Facebook
        </VaButton>
        <VaButton preset="secondary" border-color="primary" class="" block="true" disabled>
          <FaGoogle class="mr-2" />
          Sign in with Google
        </VaButton>
        <VaButton preset="secondary" border-color="primary" class="" block="true" disabled>
          <FaApple class="mr-2" />
          Sign in with Apple
        </VaButton>
        <VaButton preset="secondary" border-color="primary" class="" block="true" disabled>
          <FaMicrosoft class="mr-2" />
          Sign in with Microsoft
        </VaButton>
      </article>
    </template>
  </main>
</template>
