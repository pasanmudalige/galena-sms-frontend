<template>
  <q-page class="profile-page">
    <div class="profile-shell">
      <div class="page-heading">
        <div>
          <div class="page-kicker"><q-icon name="person_outline" /> Student account</div>
          <h1>My profile</h1>
          <p>View your personal and academic information registered with Galena.</p>
        </div>
        <div class="view-only-badge"><q-icon name="visibility" /> View only</div>
      </div>

      <div v-if="loading" class="loading-state">
        <q-spinner color="primary" size="42px" />
        <span>Loading your profile…</span>
      </div>

      <template v-else-if="studentData">
        <section class="profile-identity">
          <div class="identity-glow" aria-hidden="true"></div>
          <q-avatar size="104px" class="profile-avatar">
            <q-img v-if="profilePictureUrl" :src="profilePictureUrl" :alt="studentData.student_name" />
            <span v-else>{{ getInitials(studentData.student_name) }}</span>
          </q-avatar>
          <div class="identity-copy">
            <span>Galena student</span>
            <h2>{{ studentData.student_name || 'Student' }}</h2>
            <div class="identity-meta">
              <span><q-icon name="badge" /> {{ studentData.student_id || 'Student ID unavailable' }}</span>
              <span><q-icon name="school" /> {{ studentData.year_of_al ? `${studentData.year_of_al} A/L` : 'A/L student' }}</span>
            </div>
          </div>
          <div class="account-state"><i></i><span>Account</span><strong>{{ studentData.user_id ? 'Active' : 'Pending' }}</strong></div>
        </section>

        <div class="profile-grid">
          <section class="details-card">
            <div class="card-heading"><span><q-icon name="person_outline" /></span><div><h3>Personal information</h3><p>Your registered contact details</p></div></div>
            <div class="details-list">
              <div v-for="item in personalDetails" :key="item.label" class="detail-row">
                <span class="detail-icon"><q-icon :name="item.icon" /></span>
                <div><small>{{ item.label }}</small><strong>{{ item.value || 'Not provided' }}</strong></div>
              </div>
            </div>
          </section>

          <section class="details-card">
            <div class="card-heading"><span><q-icon name="school" /></span><div><h3>Academic information</h3><p>Your current learning profile</p></div></div>
            <div class="details-list">
              <div v-for="item in academicDetails" :key="item.label" class="detail-row">
                <span class="detail-icon"><q-icon :name="item.icon" /></span>
                <div><small>{{ item.label }}</small><strong>{{ item.value || 'Not provided' }}</strong></div>
              </div>
            </div>
          </section>
        </div>

        <section class="access-card">
          <div class="access-heading"><div><span class="section-kicker">Account access</span><h3>Your Galena access status</h3></div><q-icon name="verified_user" /></div>
          <div class="access-grid">
            <div v-for="status in accountStatuses" :key="status.label" class="access-item">
              <span><q-icon :name="status.icon" /></span><div><small>{{ status.label }}</small><strong>{{ status.value }}</strong></div><q-icon name="check_circle" class="status-check" />
            </div>
          </div>
        </section>

        <section class="update-panel">
          <div class="support-icon"><q-icon name="support_agent" /></div>
          <div class="update-copy">
            <span>Need to change something?</span>
            <h3>Contact the administrator to update your details.</h3>
            <p>For security and accuracy, students cannot edit profile information directly. Send us a WhatsApp message or call the support number.</p>
          </div>
          <div class="contact-actions">
            <q-btn unelevated no-caps icon="chat" label="Send WhatsApp" :href="whatsappUrl" target="_blank" class="whatsapp-btn" />
            <q-btn outline no-caps icon="phone" label="Call 071 536 8553" href="tel:+94715368553" class="call-btn" />
          </div>
        </section>
      </template>

      <div v-else class="error-state">
        <span><q-icon name="person_off" /></span>
        <h3>Profile unavailable</h3>
        <p>{{ loadError || 'No student profile is linked to this account.' }}</p>
        <div><q-btn unelevated no-caps icon="refresh" label="Try again" color="primary" @click="loadUserData" /><q-btn flat no-caps icon="chat" label="Contact support" :href="whatsappUrl" target="_blank" /></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({ name: 'StudentProfile' })

const authStore = useAuthStore()
const studentData = ref(null)
const profilePictureUrl = ref(null)
const loading = ref(false)
const loadError = ref('')
const whatsappUrl = 'https://wa.me/94715368553?text=Hello%20Galena%20Administrator%2C%20I%20need%20to%20update%20my%20student%20profile%20details.'

const personalDetails = computed(() => [
  { label: 'Full name', value: studentData.value?.student_name, icon: 'badge' },
  { label: 'Student ID', value: studentData.value?.student_id, icon: 'fingerprint' },
  { label: 'Email address', value: studentData.value?.email, icon: 'mail_outline' },
  { label: 'Phone number', value: studentData.value?.phone, icon: 'phone_in_talk' },
  { label: 'Parent phone', value: studentData.value?.parent_phone, icon: 'contact_phone' },
])

const academicDetails = computed(() => [
  { label: 'School', value: studentData.value?.school, icon: 'account_balance' },
  { label: 'Year of A/L', value: studentData.value?.year_of_al, icon: 'event' },
  { label: 'Address', value: studentData.value?.address, icon: 'location_on' },
])

const accountStatuses = computed(() => [
  { label: 'Account status', value: studentData.value?.user_id ? 'Active' : 'Pending', icon: 'person' },
  { label: 'Portal access', value: studentData.value?.pending_access ? 'Pending' : 'Granted', icon: 'vpn_key' },
  { label: 'Email on record', value: studentData.value?.email ? 'Available' : 'Not provided', icon: 'alternate_email' },
])

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length === 1
    ? parts[0].charAt(0).toUpperCase()
    : (parts[0].charAt(0) + parts.at(-1).charAt(0)).toUpperCase()
}

const loadStudentData = async () => {
  try {
    const res = await api.get('/common/student/profile')
    if (res.status === 200 && res.data?.data) studentData.value = res.data.data
    else loadError.value = 'No student profile is linked to this account.'
  } catch (error) {
    console.error('Error loading student data:', error)
    loadError.value = 'Your student details could not be loaded.'
  }
}

const loadUserData = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) await loadStudentData()
    else loadError.value = 'Unable to load your account information.'
  } catch (error) {
    console.error('Error loading user data:', error)
    loadError.value = 'Your profile could not be loaded. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadUserData)
</script>

<style scoped>
.profile-page{min-height:100vh;padding:34px;background:transparent;font-family:"Poppins",sans-serif}.profile-shell{width:min(1220px,100%);margin:auto}.page-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:26px}.page-kicker{color:#526bd7;text-transform:uppercase;letter-spacing:.09em;font-size:.68rem;font-weight:850}.page-kicker .q-icon{margin-right:5px}.page-heading h1{margin:7px 0 3px;color:#102554;font-size:2rem;letter-spacing:-.035em}.page-heading p{margin:0;color:#7888a3}.view-only-badge{padding:9px 13px;color:#53698e;background:#edf3ff;border:1px solid #dce7fb;border-radius:99px;font-size:.72rem;font-weight:750}.view-only-badge .q-icon{margin-right:5px;color:#2f6fec}.loading-state{min-height:380px;display:grid;place-content:center;justify-items:center;gap:14px;color:#71819c}
.profile-identity{position:relative;overflow:hidden;min-height:190px;padding:34px 38px;display:flex;align-items:center;gap:25px;border-radius:24px;color:white;background:radial-gradient(circle at 88% 10%,rgba(67,203,232,.33),transparent 25%),linear-gradient(120deg,#0d2c66,#2869dc 65%,#7443eb);box-shadow:0 20px 44px rgba(31,71,149,.2)}.identity-glow{position:absolute;width:260px;height:260px;right:-80px;bottom:-180px;border-radius:50%;background:rgba(255,255,255,.12)}.profile-avatar{flex:none;color:white;background:rgba(255,255,255,.17);border:4px solid rgba(255,255,255,.75);font-size:34px;font-weight:850;box-shadow:0 12px 25px rgba(4,20,55,.2)}.identity-copy{position:relative;z-index:1}.identity-copy>span{color:#84e8f8;text-transform:uppercase;letter-spacing:.1em;font-size:.66rem;font-weight:850}.identity-copy h2{margin:7px 0 13px;font-size:clamp(1.65rem,3vw,2.3rem);letter-spacing:-.035em}.identity-meta{display:flex;flex-wrap:wrap;gap:10px}.identity-meta span{padding:7px 10px;color:#d8e5f7;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:9px;font-size:.7rem}.identity-meta .q-icon{margin-right:4px;color:#7de1f4}.account-state{position:relative;z-index:1;margin-left:auto;padding:15px 20px;display:grid;grid-template-columns:auto 1fr;column-gap:8px;border:1px solid rgba(255,255,255,.18);border-radius:15px;background:rgba(255,255,255,.11);backdrop-filter:blur(8px)}.account-state i{grid-row:1/3;width:9px;height:9px;margin-top:5px;border-radius:50%;background:#51dca4;box-shadow:0 0 0 5px rgba(81,220,164,.13)}.account-state span{color:#b9cae4;font-size:.62rem}.account-state strong{font-size:.85rem}
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}.details-card,.access-card{padding:27px;border:1px solid #e4ebf5;border-radius:20px;background:white;box-shadow:0 10px 30px rgba(26,53,105,.06)}.card-heading{display:flex;align-items:center;gap:13px;padding-bottom:19px;border-bottom:1px solid #e9eef6}.card-heading>span{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;color:#2f6fec;background:#edf3ff;font-size:23px}.card-heading>div{display:grid}.card-heading h3,.access-heading h3{margin:0;color:#142b55;font-size:1rem}.card-heading p{margin:4px 0 0;color:#8492a8;font-size:.7rem}.details-list{display:grid}.detail-row{min-height:70px;padding:13px 2px;display:flex;align-items:center;gap:13px;border-bottom:1px solid #edf1f7}.detail-row:last-child{border:0}.detail-icon{width:34px;height:34px;display:grid;place-items:center;flex:none;border-radius:10px;color:#657da9;background:#f4f7fb;font-size:18px}.detail-row>div{min-width:0;display:grid;gap:4px}.detail-row small{color:#8997ad;font-size:.65rem}.detail-row strong{overflow-wrap:anywhere;color:#243a63;font-size:.79rem;font-weight:650}
.access-card{margin-top:20px}.access-heading{display:flex;align-items:center;justify-content:space-between}.access-heading>.q-icon{color:#dce6f8;font-size:52px}.section-kicker{color:#526bd7;text-transform:uppercase;letter-spacing:.09em;font-size:.62rem;font-weight:850}.access-heading h3{margin-top:5px;font-size:1.1rem}.access-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:20px}.access-item{min-height:74px;padding:14px;display:flex;align-items:center;gap:11px;border:1px solid #e5ecf6;border-radius:14px;background:#f8faff}.access-item>span{width:38px;height:38px;display:grid;place-items:center;flex:none;border-radius:11px;color:#2f6fec;background:#e9f1ff;font-size:20px}.access-item>div{display:grid;gap:3px}.access-item small{color:#8695ad;font-size:.62rem}.access-item strong{color:#243b65;font-size:.76rem}.status-check{margin-left:auto;color:#1ea979;font-size:19px}
.update-panel{margin-top:20px;padding:28px 30px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:19px;border:1px solid #dfe8f7;border-radius:20px;background:linear-gradient(135deg,#f7faff,#eef4ff)}.support-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;color:white;background:linear-gradient(135deg,#2f6fec,#7443eb);font-size:28px;box-shadow:0 10px 22px rgba(70,79,212,.2)}.update-copy>span{color:#5570d7;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;font-weight:850}.update-copy h3{margin:5px 0;color:#142b55;font-size:1.05rem}.update-copy p{max-width:650px;margin:0;color:#73839d;font-size:.72rem;line-height:1.6}.contact-actions{display:flex;gap:9px}.whatsapp-btn,.call-btn{min-height:44px;padding:0 16px;border-radius:11px;font-weight:750}.whatsapp-btn{color:white;background:#1ea979}.call-btn{color:#2f6fec;background:white}.error-state{min-height:430px;display:grid;place-content:center;justify-items:center;text-align:center}.error-state>span{width:68px;height:68px;display:grid;place-items:center;border-radius:19px;color:#657caa;background:#edf3ff;font-size:34px}.error-state h3{margin:17px 0 7px;color:#142b55}.error-state p{max-width:500px;margin:0 0 17px;color:#75859f}.error-state>div{display:flex;gap:8px}
@media(max-width:900px){.profile-grid{grid-template-columns:1fr}.update-panel{grid-template-columns:auto 1fr}.contact-actions{grid-column:1/-1}.access-grid{grid-template-columns:1fr}}
@media(max-width:600px){.profile-page{padding:18px 14px}.page-heading{align-items:flex-start}.page-heading p{max-width:250px;font-size:.74rem}.view-only-badge{font-size:0}.view-only-badge .q-icon{margin:0;font-size:19px}.profile-identity{padding:28px 22px;display:grid;justify-items:center;text-align:center}.profile-avatar{width:88px!important;height:88px!important;font-size:29px}.identity-meta{justify-content:center}.account-state{margin:4px 0 0}.details-card,.access-card{padding:20px}.update-panel{padding:24px 20px;grid-template-columns:1fr;justify-items:start}.contact-actions{display:grid;width:100%}.whatsapp-btn,.call-btn{width:100%}}
</style>
