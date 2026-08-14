<template>
  <q-page class="admin-dashboard-page">
    <div class="admin-dashboard-shell">
      <section class="admin-hero">
        <div class="hero-copy">
          <div class="hero-kicker"><q-icon name="auto_awesome" /> Galena administration</div>
          <h1>Everything you need to manage Galena.</h1>
          <p>Monitor your institute and move quickly to the areas that need your attention.</p>
          <div class="hero-actions">
            <q-btn unelevated no-caps icon="person_add" label="Add student" to="/admin/students" class="hero-primary" />
            <q-btn flat no-caps icon="refresh" label="Refresh overview" :loading="loading" class="hero-secondary" @click="loadDashboard" />
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="visual-ring ring-one"></div><div class="visual-ring ring-two"></div>
          <div class="visual-center"><q-icon name="space_dashboard" /></div>
          <span class="visual-chip chip-one"><q-icon name="school" /> Students</span>
          <span class="visual-chip chip-two"><q-icon name="class" /> Classes</span>
          <span class="visual-chip chip-three"><q-icon name="insights" /> Overview</span>
        </div>
      </section>

      <section class="overview-section">
        <div class="section-heading"><div><span>Live overview</span><h2>Institute at a glance</h2></div><small>Updated from your current records</small></div>
        <div class="metric-grid">
          <article v-for="metric in metrics" :key="metric.label" class="metric-card">
            <span class="metric-icon"><q-icon :name="metric.icon" /></span>
            <div class="metric-copy"><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong><span>{{ metric.note }}</span></div>
            <q-icon name="north_east" class="metric-arrow" />
          </article>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="workspace-card management-card">
          <div class="card-heading"><div><span>Management</span><h2>Quick access</h2></div><q-icon name="grid_view" /></div>
          <div class="management-grid">
            <router-link v-for="action in managementActions" :key="action.label" :to="action.route" class="management-action">
              <span><q-icon :name="action.icon" /></span><div><strong>{{ action.label }}</strong><small>{{ action.description }}</small></div><q-icon name="arrow_forward" class="action-arrow" />
            </router-link>
          </div>
        </section>

        <section class="workspace-card health-card">
          <div class="card-heading"><div><span>Record health</span><h2>Current status</h2></div><q-icon name="monitor_heart" /></div>
          <div class="health-list">
            <div class="health-row">
              <div class="health-label"><span><q-icon name="people" /></span><div><strong>Active students</strong><small>{{ students.active }} of {{ students.total }} records</small></div></div>
              <strong>{{ studentActiveRate }}%</strong>
              <div class="progress-track"><i :style="{ width: `${studentActiveRate}%` }"></i></div>
            </div>
            <div class="health-row">
              <div class="health-label"><span><q-icon name="school" /></span><div><strong>Active classes</strong><small>{{ classes.active }} of {{ classes.total }} records</small></div></div>
              <strong>{{ classActiveRate }}%</strong>
              <div class="progress-track"><i :style="{ width: `${classActiveRate}%` }"></i></div>
            </div>
          </div>
          <div class="health-note"><q-icon name="verified" /><div><strong>System records connected</strong><span>This overview reflects the latest available dashboard data.</span></div></div>
        </section>
      </div>

      <section class="workspace-card activity-card">
        <div class="card-heading"><div><span>Daily workflow</span><h2>Common administrator tasks</h2></div><q-icon name="bolt" /></div>
        <div class="workflow-grid">
          <router-link to="/admin/enrollments"><span>01</span><q-icon name="how_to_reg" /><strong>Manage enrolments</strong><small>Connect students with the right classes.</small></router-link>
          <router-link to="/admin/attendance"><span>02</span><q-icon name="fact_check" /><strong>Review attendance</strong><small>Record and review class participation.</small></router-link>
          <router-link to="/admin/payments"><span>03</span><q-icon name="payments" /><strong>Manage payments</strong><small>Keep student payment records organised.</small></router-link>
          <router-link to="/admin/documents"><span>04</span><q-icon name="folder_open" /><strong>Publish resources</strong><small>Share learning documents with students.</small></router-link>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

defineOptions({ name: 'AdminDashboard' })

const students = ref({ total: 0, active: 0, inactive: 0 })
const classes = ref({ total: 0, active: 0, inactive: 0 })
const loading = ref(false)

const studentActiveRate = computed(() => students.value.total ? Math.round((students.value.active / students.value.total) * 100) : 0)
const classActiveRate = computed(() => classes.value.total ? Math.round((classes.value.active / classes.value.total) * 100) : 0)
const metrics = computed(() => [
  { label: 'Total students', value: students.value.total, note: `${students.value.active} currently active`, icon: 'groups' },
  { label: 'Active students', value: students.value.active, note: `${students.value.inactive} inactive records`, icon: 'how_to_reg' },
  { label: 'Total classes', value: classes.value.total, note: `${classes.value.active} currently active`, icon: 'school' },
  { label: 'Active classes', value: classes.value.active, note: `${classes.value.inactive} inactive records`, icon: 'auto_stories' },
])

const managementActions = [
  { label: 'Students', description: 'Profiles and access', icon: 'groups', route: '/admin/students' },
  { label: 'Classes', description: 'Programs and schedules', icon: 'school', route: '/admin/classes' },
  { label: 'Enrolments', description: 'Student class access', icon: 'how_to_reg', route: '/admin/enrollments' },
  { label: 'Documents', description: 'Learning resources', icon: 'folder_open', route: '/admin/documents' },
]

const loadDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/auth/getDashboardData')
    if (res.status === 200 && res.data?.data) {
      students.value = res.data.data.students || students.value
      classes.value = res.data.data.classes || classes.value
    }
  } catch (error) {
    console.error('Dashboard load error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.admin-dashboard-page{min-height:100vh;padding:30px;background:transparent;font-family:"Poppins",sans-serif}.admin-dashboard-shell{width:min(1420px,100%);margin:auto}.admin-hero{min-height:315px;padding:46px 50px;display:grid;grid-template-columns:1.25fr .75fr;align-items:center;overflow:hidden;position:relative;border-radius:28px;color:white;background:radial-gradient(circle at 85% 15%,rgba(67,203,232,.3),transparent 24%),linear-gradient(120deg,#0b285d,#2869d7 65%,#7443eb);box-shadow:0 22px 50px rgba(31,71,149,.21)}.hero-kicker{color:#83e8f8;text-transform:uppercase;letter-spacing:.1em;font-size:.68rem;font-weight:850}.hero-kicker .q-icon{margin-right:5px}.hero-copy h1{max-width:680px;margin:16px 0 13px;font-size:clamp(2.2rem,4vw,3.65rem);line-height:1.04;letter-spacing:-.05em}.hero-copy>p{max-width:630px;margin:0;color:#c9d7eb;line-height:1.65}.hero-actions{display:flex;gap:10px;margin-top:28px}.hero-actions .q-btn{min-height:47px;padding:0 18px;border-radius:12px;font-weight:750}.hero-primary{color:#285bc5;background:white}.hero-secondary{color:white;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08)}.hero-visual{height:230px;position:relative;display:grid;place-items:center}.visual-ring{position:absolute;border:1px solid rgba(255,255,255,.18);border-radius:50%}.ring-one{width:205px;height:205px}.ring-two{width:145px;height:145px}.visual-center{width:88px;height:88px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.3);border-radius:25px;background:rgba(255,255,255,.14);backdrop-filter:blur(10px);font-size:43px;box-shadow:0 18px 35px rgba(5,25,67,.22)}.visual-chip{position:absolute;padding:9px 13px;display:flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.2);border-radius:99px;background:rgba(7,31,76,.52);backdrop-filter:blur(8px);font-size:.68rem;font-weight:700}.chip-one{top:10px;left:5px}.chip-two{right:0;top:75px}.chip-three{bottom:7px;left:15px}
.overview-section{margin-top:35px}.section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:17px}.section-heading span,.card-heading span{color:#526bd7;text-transform:uppercase;letter-spacing:.09em;font-size:.62rem;font-weight:850}.section-heading h2,.card-heading h2{margin:4px 0 0;color:#122957;font-size:1.25rem}.section-heading>small{color:#8a98ae}.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.metric-card{min-height:148px;padding:21px;display:flex;align-items:flex-start;gap:14px;position:relative;border:1px solid #e3eaf5;border-radius:19px;background:white;box-shadow:0 10px 28px rgba(26,53,105,.06);transition:.22s}.metric-card:hover{transform:translateY(-4px);box-shadow:0 16px 35px rgba(26,53,105,.11)}.metric-icon{width:45px;height:45px;display:grid;place-items:center;flex:none;border-radius:13px;color:#2f6fec;background:#edf3ff;font-size:23px}.metric-copy{display:grid}.metric-copy small{color:#8391a8;font-size:.66rem}.metric-copy strong{margin:6px 0;color:#102554;font-size:1.7rem;line-height:1}.metric-copy span{color:#73839c;font-size:.65rem}.metric-arrow{position:absolute;right:17px;top:17px;color:#cad5e7;font-size:17px}
.dashboard-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:20px;margin-top:20px}.workspace-card{padding:27px;border:1px solid #e3eaf5;border-radius:21px;background:white;box-shadow:0 10px 30px rgba(26,53,105,.06)}.card-heading{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid #e9eef6}.card-heading>.q-icon{color:#d4dff0;font-size:33px}.management-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:20px}.management-action{min-height:84px;padding:14px;display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none;border:1px solid #e5ebf5;border-radius:14px;background:#fafcff;transition:.2s}.management-action:hover{border-color:#cddcff;background:#f4f7ff}.management-action>span{width:42px;height:42px;display:grid;place-items:center;flex:none;border-radius:12px;color:#2f6fec;background:#eaf1ff;font-size:21px}.management-action>div{display:grid;gap:3px}.management-action strong{color:#20375f;font-size:.77rem}.management-action small{color:#8492a9;font-size:.61rem}.action-arrow{margin-left:auto;color:#a5b4ca}.health-list{display:grid;gap:22px;margin-top:23px}.health-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px}.health-label{display:flex;align-items:center;gap:11px}.health-label>span{width:37px;height:37px;display:grid;place-items:center;border-radius:11px;color:#2f6fec;background:#edf3ff;font-size:19px}.health-label>div{display:grid}.health-label strong{color:#263c63;font-size:.75rem}.health-label small{margin-top:3px;color:#8a98ad;font-size:.61rem}.health-row>strong{color:#2f6fec;font-size:.8rem}.progress-track{grid-column:1/-1;height:7px;overflow:hidden;border-radius:99px;background:#e9eef7}.progress-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#43cbe8,#2f6fec,#7443eb)}.health-note{margin-top:25px;padding:14px;display:flex;align-items:center;gap:10px;border-radius:13px;background:#f2f7ff}.health-note>.q-icon{color:#1ea979;font-size:23px}.health-note>div{display:grid}.health-note strong{color:#304568;font-size:.7rem}.health-note span{margin-top:3px;color:#8392a9;font-size:.58rem}
.activity-card{margin-top:20px}.workflow-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:20px}.workflow-grid>a{min-height:165px;padding:20px;display:grid;align-content:start;position:relative;color:inherit;text-decoration:none;border:1px solid #e5ebf5;border-radius:16px;background:#fafcff;transition:.2s}.workflow-grid>a:hover{transform:translateY(-3px);border-color:#ccdcfb;background:#f5f8ff}.workflow-grid>a>span{position:absolute;right:14px;top:12px;color:#dfe6f1;font-size:1.4rem;font-weight:850}.workflow-grid>a>.q-icon{width:42px;height:42px;display:grid;place-items:center;margin-bottom:16px;border-radius:12px;color:#2f6fec;background:#eaf1ff;font-size:22px}.workflow-grid strong{color:#20375f;font-size:.78rem}.workflow-grid small{margin-top:7px;color:#8190a8;font-size:.63rem;line-height:1.5}
@media(max-width:1100px){.metric-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid{grid-template-columns:1fr}.workflow-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.admin-dashboard-page{padding:16px}.admin-hero{padding:32px 23px;grid-template-columns:1fr}.hero-visual{display:none}.hero-copy h1{font-size:2.35rem}.hero-actions{display:grid}.section-heading{align-items:flex-start}.section-heading>small{display:none}.metric-grid,.management-grid,.workflow-grid{grid-template-columns:1fr}.metric-card{min-height:125px}.workspace-card{padding:21px}}
</style>
