<template>
  <q-page class="login-page">
    <div class="login-orb orb-one" aria-hidden="true"></div>
    <div class="login-orb orb-two" aria-hidden="true"></div>

    <header class="login-header">
      <router-link to="/" aria-label="Back to Galena home"><img src="~assets/galena.png" alt="Galena" /></router-link>
      <q-btn flat no-caps icon="arrow_back" label="Back to home" to="/" class="home-btn" />
    </header>

    <main class="login-shell">
      <section class="login-story">
        <div class="story-copy">
          <div class="story-kicker"><q-icon name="auto_awesome" /> Welcome back to Galena</div>
          <h1>Your learning journey <span>continues here.</span></h1>
          <p>Access your classes, learning materials, attendance, payments, and progress from one connected student portal.</p>
        </div>

        <div class="portal-preview">
          <div class="preview-top"><span></span><span></span><span></span><small>Student portal</small></div>
          <div class="preview-main">
            <div class="preview-welcome"><span>Good to see you again</span><strong>Keep building your future.</strong></div>
            <div class="preview-cards">
              <div><q-icon name="school" /><strong>Classes</strong><small>Your learning schedule</small></div>
              <div><q-icon name="description" /><strong>Resources</strong><small>Study materials ready</small></div>
              <div><q-icon name="insights" /><strong>Progress</strong><small>Stay on track</small></div>
            </div>
          </div>
        </div>

        <div class="story-footer"><q-icon name="verified" /><span>Focused A/L science education since 2019</span></div>
      </section>

      <section class="login-form-panel">
        <div class="form-wrap">
          <div class="form-icon"><q-icon name="lock_open" /></div>
          <span class="form-eyebrow">Student &amp; staff access</span>
          <h2>Sign in to your account</h2>
          <p class="form-lead">Enter your registered email and password to continue.</p>

          <q-form @submit="onSubmit" class="login-form">
            <label for="login-email">Email address</label>
            <q-input
              id="login-email"
              v-model="form.email"
              outlined
              type="email"
              placeholder="you@example.com"
              :rules="rules.email"
              class="modern-input"
            >
              <template #prepend><q-icon name="mail_outline" /></template>
            </q-input>

            <div class="password-label"><label for="login-password">Password</label><button type="button" @click="navigateToForgotPassword">Forgot password?</button></div>
            <q-input
              id="login-password"
              v-model="form.password"
              outlined
              placeholder="Enter your password"
              :type="showNewPassword ? 'text' : 'password'"
              :rules="rules.passwordLogin"
              class="modern-input"
            >
              <template #prepend><q-icon name="key" /></template>
              <template #append>
                <q-icon :name="showNewPassword ? 'visibility' : 'visibility_off'" class="visibility-toggle" @click="toggleNewPassword" />
              </template>
            </q-input>

            <q-btn unelevated no-caps label="Sign in" icon-right="arrow_forward" type="submit" class="sign-in-btn full-width" />
          </q-form>

          <div class="new-student">
            <span>New to Galena?</span>
            <router-link to="/student-register">Create a student account <q-icon name="arrow_forward" /></router-link>
          </div>

          <div class="secure-note"><q-icon name="shield" /> Secure access to your Galena account</div>
        </div>
        <footer>© {{ currentYear }} Galena Educational Institute · Galle, Sri Lanka</footer>
      </section>
    </main>

    <q-dialog v-model="showBlockedDialog" persistent>
      <q-card class="support-dialog">
        <q-card-section class="dialog-heading negative-heading"><span><q-icon name="block" /></span><div><h3>Account blocked</h3><p>We’ll help you regain access.</p></div><q-space /><q-btn icon="close" flat round dense v-close-popup /></q-card-section>
        <q-card-section class="dialog-body">
          <p>Your account is currently blocked. Contact our support team via WhatsApp and include your Student ID.</p>
          <div class="support-number"><q-icon name="whatsapp" /> +94 71 53 685 53</div>
          <q-btn unelevated no-caps icon="whatsapp" label="Contact support" :href="whatsappSupportUrl" target="_blank" class="whatsapp-btn full-width" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showForgotPasswordDialog">
      <q-card class="support-dialog">
        <q-card-section class="dialog-heading"><span><q-icon name="key" /></span><div><h3>Reset password</h3><p>Request help through WhatsApp.</p></div><q-space /><q-btn icon="close" flat round dense v-close-popup /></q-card-section>
        <q-card-section class="dialog-body">
          <p>Send the message below to our support team. Replace the placeholder with your actual Student ID.</p>
          <div class="message-template">Please reset my password {Student ID}</div>
          <q-btn unelevated no-caps icon="whatsapp" label="Send WhatsApp message" :href="whatsappUrl" target="_blank" class="whatsapp-btn full-width" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showSuccessNotification, showErrorNotification } from 'src/utils/notification'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store'
import { rules } from 'src/utils/validation-rules'
import { setAccessToken } from 'src/utils/cookie-storage'

defineOptions({ name: 'AuthLogin' })

const router = useRouter()
const authStore = useAuthStore()
const currentYear = new Date().getFullYear()
const form = ref({ email: '', password: '', isWeb: true })
const showNewPassword = ref(false)
const showForgotPasswordDialog = ref(false)
const showBlockedDialog = ref(false)

const toggleNewPassword = () => { showNewPassword.value = !showNewPassword.value }
const whatsappUrl = computed(() => `https://wa.me/94715368553?text=${encodeURIComponent('Please reset my password {Student ID}')}`)
const whatsappSupportUrl = computed(() => `https://wa.me/94715368553?text=${encodeURIComponent('Hello, my account has been blocked. Please help me. Student ID: {Student ID}')}`)

const onSubmit = async () => {
  try {
    const response = await authStore.loginApi(form.value)
    if (response.status === 200) {
      if (response.data.code === 200) {
        const token = response.data.accessToken
        const user = response.data.user
        if (token) setAccessToken(token)
        showSuccessNotification('Successfully logged in')
        router.push(user?.role === 'student' ? '/student/dashboard' : '/admin/dashboard')
      } else {
        showErrorNotification(response.data.message)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response?.status === 403 && error.response?.data?.blocked) {
      showBlockedDialog.value = true
    } else if (error.response?.status === 400 || error.response?.status === 403) {
      showErrorNotification(error.response.data.message)
    } else {
      showErrorNotification(error.response?.data?.message || 'Internal Server Error')
    }
  }
}

const navigateToForgotPassword = () => { showForgotPasswordDialog.value = true }
</script>

<style scoped>
.login-page { min-height:100vh; position:relative; overflow:hidden; color:#102554; background:linear-gradient(145deg,#f3f8ff,#f8fbff 52%,#f6f1ff); font-family:Inter,"Segoe UI",sans-serif; }
.login-orb { position:absolute; border-radius:50%; pointer-events:none; }.orb-one { width:430px;height:430px;top:-220px;left:-160px;background:rgba(34,211,238,.16); }.orb-two { width:470px;height:470px;right:-220px;bottom:-210px;background:rgba(124,58,237,.13); }
.login-header { position:relative;z-index:2; width:min(1220px,calc(100% - 48px));height:84px;margin:auto;display:flex;align-items:center;justify-content:space-between; }.login-header img { width:112px;display:block; }.home-btn { color:#2e4266;font-weight:750;border-radius:12px; }
.login-shell { position:relative;z-index:1; width:min(1140px,calc(100% - 48px));min-height:720px;margin:20px auto 65px;display:grid;grid-template-columns:1.05fr .95fr;overflow:hidden;border-radius:31px;background:white;box-shadow:0 30px 85px rgba(20,48,100,.15); }
.login-story { position:relative; padding:60px;display:flex;flex-direction:column;justify-content:center;color:white;background:radial-gradient(circle at 10% 90%,rgba(34,211,238,.2),transparent 32%),linear-gradient(145deg,#091f49,#173f8a 62%,#5935be); }
.login-story:after { content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.12) 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(135deg,black,transparent 68%);pointer-events:none; }.story-copy,.portal-preview,.story-footer { position:relative;z-index:1; }.story-kicker { display:flex;align-items:center;gap:7px;color:#75e7ff;text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;font-weight:850; }.story-copy h1 { max-width:520px;margin:18px 0;font-size:clamp(2.65rem,4.1vw,4rem);line-height:1.02;letter-spacing:-.05em;font-weight:850; }.story-copy h1 span { color:#71e3ff; }.story-copy>p { max-width:510px;margin:0;color:#c3d1e8;line-height:1.7; }
.portal-preview { margin-top:40px;padding:13px;border:1px solid rgba(255,255,255,.18);border-radius:23px;background:rgba(255,255,255,.09);backdrop-filter:blur(10px);box-shadow:0 25px 50px rgba(3,15,42,.28);transform:rotate(-1deg); }.preview-top { height:29px;display:flex;align-items:center;gap:5px;padding:0 5px; }.preview-top>span { width:7px;height:7px;border-radius:50%;background:#fb7185; }.preview-top>span:nth-child(2){background:#fbbf24}.preview-top>span:nth-child(3){background:#22c55e}.preview-top small { margin-left:auto;color:#bcd0ec;font-size:.66rem; }.preview-main { padding:20px;border-radius:15px;background:white; }.preview-welcome { display:grid;color:#8090a8;font-size:.72rem; }.preview-welcome strong { margin-top:3px;color:#102554;font-size:1.1rem; }.preview-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:17px; }.preview-cards>div { min-height:95px;padding:13px;display:grid;align-content:start;gap:4px;border-radius:12px;background:#edf5ff; }.preview-cards>div:nth-child(2){background:#f5f0ff}.preview-cards>div:nth-child(3){background:#fff6df}.preview-cards .q-icon { color:#3477e9;font-size:21px; }.preview-cards>div:nth-child(2) .q-icon{color:#8148e9}.preview-cards>div:nth-child(3) .q-icon{color:#e29a19}.preview-cards strong { color:#19325f;font-size:.72rem; }.preview-cards small { color:#8391aa;font-size:.57rem; }.story-footer { display:flex;align-items:center;gap:9px;margin-top:34px;color:#bfcce2;font-size:.77rem; }.story-footer .q-icon { color:#70e0a9;font-size:21px; }
.login-form-panel { padding:58px 64px 30px;display:flex;flex-direction:column;justify-content:space-between;background:rgba(255,255,255,.98); }.form-wrap { width:100%;max-width:410px;margin:auto; }.form-icon { width:54px;height:54px;display:grid;place-items:center;margin-bottom:20px;border-radius:16px;color:white;background:linear-gradient(135deg,#2774ec,#8040ed);font-size:27px;box-shadow:0 13px 27px rgba(83,69,222,.24); }.form-eyebrow { color:#5573db;text-transform:uppercase;letter-spacing:.09em;font-size:.69rem;font-weight:850; }.form-wrap h2 { margin:8px 0 7px;font-size:2rem;line-height:1.15;letter-spacing:-.035em; }.form-lead { margin:0 0 31px;color:#7887a1;font-size:.9rem;line-height:1.55; }.login-form label,.password-label label { display:block;margin:0 0 8px;color:#354a70;font-size:.79rem;font-weight:800; }.password-label { display:flex;align-items:center;justify-content:space-between;margin-top:3px; }.password-label button { border:0;padding:0;background:transparent;color:#4c65d9;font-size:.75rem;font-weight:750;cursor:pointer; }.modern-input { margin-bottom:7px; }.modern-input :deep(.q-field__control) { min-height:55px;border-radius:13px;background:#fafcff;transition:.2s; }.modern-input :deep(.q-field__prepend) { color:#7890bc; }.modern-input :deep(.q-field__control:hover) { background:white; }.modern-input :deep(.q-field--focused .q-field__control) { background:white;box-shadow:0 0 0 3px rgba(59,105,225,.08); }.visibility-toggle { color:#8191ac;cursor:pointer; }.sign-in-btn { min-height:54px;margin-top:8px;border-radius:14px;color:white;background:linear-gradient(110deg,#226eea,#6844ed 70%,#9b38e8);font-size:.95rem;font-weight:800;box-shadow:0 13px 28px rgba(77,74,224,.25); }
.new-student { display:grid;gap:7px;margin-top:25px;padding:17px;text-align:center;border:1px solid #e3eaf7;border-radius:14px;background:#f8faff; }.new-student>span { color:#8795ad;font-size:.75rem; }.new-student a { color:#4161d5;text-decoration:none;font-size:.82rem;font-weight:800; }.secure-note { margin-top:18px;text-align:center;color:#8b99af;font-size:.7rem; }.secure-note .q-icon { margin-right:4px;color:#28ad79; }.login-form-panel footer { margin-top:35px;text-align:center;color:#9aa6b8;font-size:.64rem; }
.support-dialog { width:min(450px,calc(100vw - 30px));border-radius:23px; }.dialog-heading { padding:25px 25px 15px;display:flex;align-items:center;gap:13px; }.dialog-heading>span { width:45px;height:45px;display:grid;place-items:center;border-radius:13px;color:#5a47dc;background:#eeeaff;font-size:23px; }.negative-heading>span { color:#df3d58;background:#fff0f2; }.dialog-heading h3 { margin:0;color:#142a55;font-size:1.2rem; }.dialog-heading p { margin:3px 0 0;color:#8a98ae;font-size:.73rem; }.dialog-body { padding:10px 25px 28px;color:#697995;line-height:1.6; }.support-number,.message-template { margin:17px 0;padding:14px;text-align:center;border-radius:11px;background:#f3f6fb;color:#344968;font-weight:750; }.support-number .q-icon { color:#18a96b;margin-right:5px; }.message-template { font-family:monospace;font-size:.8rem; }.whatsapp-btn { min-height:47px;border-radius:12px;color:white;background:#16af6d;font-weight:750; }
@media (max-width:900px) { .login-shell { grid-template-columns:1fr;max-width:680px; }.login-story { padding:45px; }.portal-preview { max-width:540px; }.login-form-panel { padding:50px 55px 30px; }.form-wrap { max-width:480px; } }
@media (max-width:600px) { .login-header { width:calc(100% - 32px);height:70px; }.login-header img { width:88px; }.home-btn :deep(.q-btn__content){font-size:0}.home-btn :deep(.q-icon){font-size:22px}.login-shell { width:calc(100% - 20px);min-height:0;margin:8px auto 35px;border-radius:23px; }.login-story { padding:35px 23px; }.story-copy h1 { font-size:2.65rem; }.story-copy>p { font-size:.88rem; }.portal-preview { margin-top:30px;padding:9px; }.preview-main { padding:15px; }.preview-cards { gap:6px; }.preview-cards>div { min-height:82px;padding:9px; }.preview-cards small { display:none; }.story-footer { margin-top:25px; }.login-form-panel { padding:42px 23px 25px; }.form-wrap h2 { font-size:1.75rem; }.login-form-panel footer { margin-top:30px; } }
</style>
