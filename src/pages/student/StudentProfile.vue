<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <div class="text-h4 text-weight-bold text-grey-8">My Profile</div>
          <div class="text-subtitle2 text-grey-6">View your profile information</div>
        </div>
      </div>

      <div v-if="studentData" class="row q-col-gutter-md">
        <!-- Profile Picture Card -->
        <div class="col-12">
          <q-card flat bordered class="profile-header-card">
            <q-card-section class="q-pa-xl text-center">
              <div class="flex flex-center q-mb-md">
                <q-avatar
                  size="120px"
                  :color="avatarColor"
                  text-color="white"
                  font-size="48px"
                  class="profile-avatar"
                >
                  <q-img
                    v-if="profilePictureUrl"
                    :src="profilePictureUrl"
                    :alt="studentData.student_name"
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                  <span v-else>{{ getInitials(studentData.student_name) }}</span>
                </q-avatar>
              </div>
              <div class="text-h5 text-weight-bold q-mt-md">
                {{ studentData.student_name }}
              </div>
              <div class="text-subtitle1 text-weight-bold text-black q-mt-xs">
                {{ studentData.student_id || 'N/A' }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Personal Information -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="person" color="primary" size="24px" class="q-mr-xs" />
                    Personal Information
                  </div>
                </div>
              </div>
              <q-separator class="q-mb-md" />

              <div class="q-gutter-md">
                <div class="info-item">
                  <div class="text-overline text-grey-7">Full Name</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    {{ studentData.student_name || '-' }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Student ID</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <div class="text-subtitle1 text-weight-bold text-black-10 q-mt-xs">
                      {{ studentData.student_id || 'N/A' }}
                    </div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Email Address</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-icon name="email" size="16px" color="grey-6" class="q-mr-xs" />
                    {{ studentData.email || '-' }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Phone Number</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-icon name="phone" size="16px" color="grey-6" class="q-mr-xs" />
                    {{ studentData.phone || '-' }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Parent Phone</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-icon name="phone" size="16px" color="grey-6" class="q-mr-xs" />
                    {{ studentData.parent_phone || '-' }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Academic Information -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="school" color="positive" size="24px" class="q-mr-xs" />
                    Academic Information
                  </div>
                </div>
              </div>
              <q-separator class="q-mb-md" />

              <div class="q-gutter-md">
                <div class="info-item">
                  <div class="text-overline text-grey-7">School</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-icon name="location_city" size="16px" color="grey-6" class="q-mr-xs" />
                    {{ studentData.school || '-' }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Year of A/L</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-chip
                      v-if="studentData.year_of_al"
                      size="sm"
                      color="info"
                      text-color="white"
                      icon="calendar_today"
                    >
                      {{ studentData.year_of_al }}
                    </q-chip>
                    <span v-else>-</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="text-overline text-grey-7">Address</div>
                  <div class="text-body1 text-weight-medium text-grey-9 q-mt-xs">
                    <q-icon name="home" size="16px" color="grey-6" class="q-mr-xs" />
                    {{ studentData.address || '-' }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Account Status -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6 text-weight-bold text-grey-8">
                    <q-icon name="info" color="orange" size="24px" class="q-mr-xs" />
                    Account Status
                  </div>
                </div>
              </div>
              <q-separator class="q-mb-md" />

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="text-center q-pa-md bg-blue-1 rounded-borders">
                    <q-icon name="check_circle" size="32px" color="positive" class="q-mb-xs" />
                    <div class="text-caption text-grey-7">Account Status</div>
                    <div class="text-body2 text-weight-bold text-positive q-mt-xs">
                      {{ studentData.user_id ? 'Active' : 'Pending' }}
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="text-center q-pa-md bg-green-1 rounded-borders">
                    <q-icon name="vpn_key" size="32px" color="primary" class="q-mb-xs" />
                    <div class="text-caption text-grey-7">Access Status</div>
                    <div class="text-body2 text-weight-bold text-primary q-mt-xs">
                      {{ studentData.pending_access ? 'Pending' : 'Granted' }}
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="text-center q-pa-md bg-purple-1 rounded-borders">
                    <q-icon name="email" size="32px" color="purple" class="q-mb-xs" />
                    <div class="text-caption text-grey-7">Email Verified</div>
                    <div class="text-body2 text-weight-bold text-purple q-mt-xs">
                      {{ studentData.email ? 'Yes' : 'No' }}
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="text-center q-pa-md bg-orange-1 rounded-borders">
                    <q-icon name="phone" size="32px" color="orange" class="q-mb-xs" />
                    <div class="text-caption text-grey-7">Phone Verified</div>
                    <div class="text-body2 text-weight-bold text-orange q-mt-xs">
                      {{ studentData.phone ? 'Yes' : 'No' }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex flex-center" style="min-height: 400px">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'

defineOptions({
  name: 'StudentProfile',
})

const authStore = useAuthStore()
const authUser = ref(null)
const studentData = ref(null)
const profilePictureUrl = ref(null)

const avatarColor = computed(() => {
  if (!studentData.value?.student_name) return 'primary'
  const colors = ['primary', 'positive', 'warning', 'negative', 'info', 'purple', 'orange']
  const index = studentData.value.student_name.charCodeAt(0) % colors.length
  return colors[index]
})

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const loadUserData = async () => {
  try {
    const res = await authStore.getAuthUserDataUsingAccessToken()
    if (res.status === 200 && res.data?.data) {
      authUser.value = res.data.data
      await loadStudentData()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadStudentData = async () => {
  try {
    const res = await api.get('/admin/students')
    if (res.status === 200 && res.data?.data) {
      const student = res.data.data.find((s) => s.email === authUser.value?.email)
      if (student) {
        studentData.value = student
        // If there's a profile picture field in the future, load it here
        // profilePictureUrl.value = student.profile_picture_url
      }
    }
  } catch (error) {
    console.error('Error loading student data:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.profile-header-card :deep(.q-card__section) {
  background: transparent;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}
</style>
