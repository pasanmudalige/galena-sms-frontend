<template>
  <q-page class="landing-page">
    <q-header class="site-header text-dark" id="header">
      <q-toolbar class="header-inner">
        <q-toolbar-title class="brand-wrap">
          <img src="~assets/galena.png" alt="Galena Educational Institute" class="header-logo" />
        </q-toolbar-title>

        <nav class="nav-links gt-sm" aria-label="Main navigation">
          <button v-for="item in navigation" :key="item.id" @click="scrollTo(item.id)">
            {{ item.label }}
          </button>
        </nav>

        <q-space />
        <q-btn flat no-caps label="Log in" to="/login" class="login-btn gt-xs" />
        <q-btn
          unelevated
          no-caps
          label="Join Galena"
          to="/student-register"
          class="join-btn gt-xs"
          icon-right="arrow_forward"
        />
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Open navigation"
          class="lt-md menu-btn"
          @click="drawer = !drawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" overlay bordered class="mobile-drawer">
      <div class="drawer-brand">
        <img src="~assets/galena.png" alt="Galena" />
        <q-btn flat round dense icon="close" @click="drawer = false" />
      </div>
      <q-list padding>
        <q-item
          v-for="item in navigation"
          :key="item.id"
          clickable
          v-ripple
          @click="scrollToAndClose(item.id)"
        >
          <q-item-section avatar><q-icon :name="item.icon" color="primary" /></q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
      <div class="drawer-actions">
        <q-btn outline no-caps label="Student login" to="/login" class="full-width" />
        <q-btn unelevated no-caps label="Create student account" to="/student-register" class="full-width join-btn" />
      </div>
    </q-drawer>

    <main>
      <section id="hero" class="hero-section">
        <div class="hero-orb hero-orb-one"></div>
        <div class="hero-orb hero-orb-two"></div>
        <div class="page-shell hero-grid">
          <div class="hero-copy">
            <div class="eyebrow"><q-icon name="auto_awesome" /> Learn with purpose. Grow with confidence.</div>
            <h1>Build a brighter future through <span>better learning.</span></h1>
            <p class="hero-lead">
              Focused A/L science education, expert guidance, and a connected student experience—designed to help every learner make measurable progress.
            </p>
            <div class="hero-actions">
              <q-btn unelevated no-caps label="Create student account" to="/student-register" class="primary-cta" icon-right="arrow_forward" />
              <q-btn outline no-caps label="Explore classes" @click="scrollTo('courses')" class="secondary-cta" icon="play_circle" />
            </div>
            <div class="trust-row">
              <div><strong>Since 2019</strong><span>Trusted learning</span></div>
              <div><strong>A/L Science</strong><span>Focused programs</span></div>
              <div><strong>Galle</strong><span>Local support</span></div>
            </div>
          </div>

          <div class="hero-visual" aria-label="Galena learning experience">
            <div class="visual-card main-visual-card">
              <div class="visual-topline">
                <span class="live-dot"></span>
                <span>Learning at Galena</span>
                <q-icon name="school" />
              </div>
              <div class="hero-photo-wrap">
                <img
                  src="~assets/galena-classroom-hero.webp"
                  alt="Sri Lankan A/L science students learning with their teacher"
                  class="hero-photo"
                />
                <span class="photo-subject-badge"><q-icon name="science" /> A/L Science</span>
              </div>
              <h3>Understand. Practise. Achieve.</h3>
              <div class="progress-track"><span></span></div>
              <div class="visual-metrics"><span>Concept clarity</span><strong>92%</strong></div>
            </div>
            <div class="floating-card floating-card-one"><q-icon name="emoji_events" /><div><strong>Goal focused</strong><span>Clear progress paths</span></div></div>
            <div class="floating-card floating-card-two"><q-icon name="groups" /><div><strong>Student first</strong><span>Support that matters</span></div></div>
          </div>
        </div>
        <div class="hero-wave"></div>
      </section>

      <section id="about" class="section-block about-section">
        <div class="page-shell">
          <div class="section-heading centered-heading">
            <span class="section-kicker">Why Galena?</span>
            <h2>Education that feels clear, personal, and inspiring.</h2>
            <p>We combine academic discipline with an encouraging environment where students are known, supported, and challenged to improve.</p>
          </div>
          <div class="value-grid">
            <article v-for="(value, index) in values" :key="value.title" class="value-card" :class="`accent-${index + 1}`">
              <div class="icon-tile"><q-icon :name="value.icon" /></div>
              <span class="card-number">0{{ index + 1 }}</span>
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="courses" class="section-block courses-section">
        <div class="page-shell">
          <div class="section-heading heading-row">
            <div><span class="section-kicker light-kicker">Our classes</span><h2>Find the right path for your A/L journey.</h2></div>
            <p>Structured theory and paper classes designed to turn difficult science concepts into confident exam performance.</p>
          </div>
          <div class="course-grid">
            <article v-for="(course, index) in courses" :key="course.id" class="modern-course-card" :class="`course-${(index % 3) + 1}`">
              <div class="course-icon"><q-icon :name="course.icon" /></div>
              <div class="course-meta"><span>{{ course.stream }}</span><span>{{ course.duration }}</span></div>
              <h3>{{ course.name }}</h3>
              <p>{{ course.description }}</p>
              <button @click="$router.push('/student-register')">Enrol now <q-icon name="arrow_forward" /></button>
            </article>
          </div>
        </div>
      </section>

      <section id="teachers" class="section-block teachers-section">
        <div class="page-shell teachers-layout">
          <div class="teachers-intro">
            <span class="section-kicker">Meet your teachers</span>
            <h2>Guidance from people who know the journey.</h2>
            <p>Learn difficult concepts with approachable, subject-focused teaching and the support to keep moving forward.</p>
            <div class="teachers-note"><q-icon name="person_add" /><span>More teachers and class details are coming soon.</span></div>
          </div>
          <div class="teacher-grid">
            <article v-for="teacher in teachers" :key="teacher.name" class="teacher-card" :class="teacher.theme">
              <div class="teacher-image-wrap">
                <img :src="teacher.image" :alt="`${teacher.name}, ${teacher.subject} teacher`" />
                <span class="teacher-subject"><q-icon :name="teacher.icon" /> {{ teacher.subject }}</span>
              </div>
              <div class="teacher-details">
                <span>Galena educator</span>
                <h3>{{ teacher.name }}</h3>
                <p>{{ teacher.summary }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="facilities" class="section-block experience-section">
        <div class="page-shell experience-grid">
          <div class="experience-copy">
            <span class="section-kicker">A better student experience</span>
            <h2>Everything students need, connected in one place.</h2>
            <p>From class access to learning materials and progress information, Galena keeps the student journey organised and easy to follow.</p>
            <div class="feature-list">
              <div v-for="facility in facilities" :key="facility.id">
                <span><q-icon :name="facility.icon" /></span>
                <div><h3>{{ facility.name }}</h3><p>{{ facility.description }}</p></div>
              </div>
            </div>
          </div>
          <div class="dashboard-preview">
            <div class="preview-header"><div><span></span><span></span><span></span></div><small>Student portal</small></div>
            <div class="preview-body">
              <div class="preview-photo-wrap">
                <img
                  src="~assets/galena-student-study.webp"
                  alt="Galena students collaborating on science studies"
                  class="preview-photo"
                />
                <span><q-icon name="groups" /> Learn together</span>
              </div>
              <div class="preview-welcome"><span>Welcome back</span><strong>Your learning overview</strong></div>
              <div class="preview-stats"><div><q-icon name="school" /><strong>Classes</strong><span>All in one place</span></div><div><q-icon name="description" /><strong>Documents</strong><span>Ready to study</span></div></div>
              <div class="preview-progress"><div><strong>Monthly progress</strong><span>On track</span></div><div class="chart-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" class="impact-section">
        <div class="page-shell impact-grid">
          <div class="impact-copy"><span class="section-kicker light-kicker">The Galena difference</span><h2>Small steps.<br />Strong habits.<br /><em>Big outcomes.</em></h2></div>
          <div class="impact-points">
            <div v-for="item in impact" :key="item.title"><q-icon :name="item.icon" /><div><strong>{{ item.title }}</strong><span>{{ item.text }}</span></div></div>
          </div>
        </div>
      </section>

      <section id="contact" class="section-block contact-section">
        <div class="page-shell">
          <div class="contact-panel">
            <div class="contact-copy">
              <span class="section-kicker">Let’s talk</span>
              <h2>Ready to start your Galena journey?</h2>
              <p>Visit us in Galle, send a message, or connect on WhatsApp. We’ll help you choose the right class.</p>
              <div class="contact-details"><a href="https://maps.google.com/?q=301+Morris+Rd+Galle+80000" target="_blank"><q-icon name="location_on" /><span>301 Morris Rd, Galle 80000</span></a><a href="tel:+94715368553"><q-icon name="phone" /><span>+94 71 53 68 553</span></a><a href="mailto:edu.galenainstitute@gmail.com"><q-icon name="email" /><span>edu.galenainstitute@gmail.com</span></a></div>
              <div class="social-row"><q-btn round unelevated icon="facebook" href="https://www.facebook.com/institutegalena/" target="_blank" /><q-btn round unelevated icon="whatsapp" href="https://wa.me/94715368553" target="_blank" /><q-btn round unelevated icon="instagram" href="https://www.instagram.com/galenainstitute/" target="_blank" /></div>
            </div>
            <q-form @submit="onContactSubmit" class="contact-form">
              <div class="form-title"><q-icon name="send" /><div><strong>Send us a message</strong><span>We usually reply within one working day.</span></div></div>
              <q-input v-model="contactForm.name" outlined label="Your name" :rules="[(val) => !!val || 'Name is required']" />
              <div class="form-row"><q-input v-model="contactForm.email" outlined type="email" label="Email address" :rules="[(val) => !!val || 'Email is required', (val) => /.+@.+\..+/.test(val) || 'Invalid email']" /><q-input v-model="contactForm.phone" outlined label="Phone number" /></div>
              <q-input v-model="contactForm.message" outlined type="textarea" label="How can we help?" rows="4" :rules="[(val) => !!val || 'Message is required']" />
              <q-btn type="submit" unelevated no-caps label="Send message" icon-right="arrow_forward" class="form-submit" />
            </q-form>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="page-shell footer-grid"><div><img src="~assets/galena.png" alt="Galena" /><p>Focused learning for confident futures.</p></div><div class="footer-links"><button v-for="item in navigation.slice(1)" :key="item.id" @click="scrollTo(item.id)">{{ item.label }}</button></div><div class="footer-action"><span>Already a student?</span><q-btn flat no-caps label="Open student portal" to="/login" icon-right="login" /></div></div>
      <div class="page-shell footer-bottom"><span>© {{ currentYear }} Galena Educational Institute</span><span>Galle, Sri Lanka</span></div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import vishwaTeacher from 'assets/teacher-vishwa-physics.webp'
import kashmiraTeacher from 'assets/teacher-kashmira-chemistry.webp'

defineOptions({ name: 'WebPage' })

const $q = useQuasar()
const drawer = ref(false)
const currentYear = computed(() => new Date().getFullYear())
const navigation = [
  { id: 'hero', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'auto_awesome' },
  { id: 'courses', label: 'Classes', icon: 'school' },
  { id: 'teachers', label: 'Teachers', icon: 'co_present' },
  { id: 'facilities', label: 'Experience', icon: 'dashboard' },
  { id: 'gallery', label: 'Why Galena', icon: 'emoji_events' },
  { id: 'contact', label: 'Contact', icon: 'chat' },
]

const contactForm = ref({ name: '', email: '', phone: '', message: '' })
const teachers = [
  {
    name: 'Kashmira Karunanayake',
    subject: 'Chemistry',
    icon: 'science',
    image: kashmiraTeacher,
    summary: 'Helping students understand Chemistry through clear explanations and focused learning.',
    theme: 'chemistry-teacher',
  },
  {
    name: 'Vishwa Kankanamge',
    subject: 'Physics',
    icon: 'bolt',
    image: vishwaTeacher,
    summary: 'Making Physics concepts approachable with logical thinking and purposeful practice.',
    theme: 'physics-teacher',
  },
]
const values = [
  { title: 'Clear teaching', description: 'Complex ideas are broken into practical, understandable lessons that build lasting confidence.', icon: 'lightbulb' },
  { title: 'Consistent practice', description: 'Structured papers and purposeful revision help students turn knowledge into exam performance.', icon: 'edit_note' },
  { title: 'Personal support', description: 'A welcoming learning environment keeps every student encouraged, accountable, and moving forward.', icon: 'volunteer_activism' },
]

const courses = ref([
  { id: 1, name: 'Chemistry 2026 A/L', description: 'Focused theory, structured revision, and exam-oriented problem solving for the final stage.', duration: 'Theory', stream: '2026 A/L', icon: 'science' },
  { id: 2, name: 'Chemistry 2027 A/L', description: 'A complete foundation-to-advanced Chemistry program with continuous practice and guidance.', duration: 'Theory', stream: '2027 A/L', icon: 'science' },
  { id: 3, name: 'Chemistry 2028 A/L', description: 'Build strong fundamentals early through clear explanations, examples, and guided exercises.', duration: 'Theory', stream: '2028 A/L', icon: 'biotech' },
  { id: 4, name: 'Chemistry 2029 A/L', description: 'A confident start to A/L Chemistry with the right concepts, habits, and study framework.', duration: 'Theory', stream: '2029 A/L', icon: 'science' },
  { id: 5, name: 'Chemistry Paper Class', description: 'Timed papers, marking guidance, common-error reviews, and practical exam strategies.', duration: 'Paper class', stream: '2026 A/L', icon: 'fact_check' },
  { id: 6, name: 'Physics 2027 A/L', description: 'Concept-driven Physics teaching supported by calculations, applications, and regular practice.', duration: 'Theory', stream: '2027 A/L', icon: 'electric_bolt' },
])

const facilities = ref([
  { id: 1, name: 'Organised class access', description: 'See enrolled classes and essential details without confusion.', icon: 'school' },
  { id: 2, name: 'Learning documents', description: 'Access class materials securely whenever they are released.', icon: 'description' },
  { id: 3, name: 'Attendance visibility', description: 'Stay aware of participation and maintain consistent learning habits.', icon: 'event_available' },
  { id: 4, name: 'Connected support', description: 'Keep communication and student information in one reliable place.', icon: 'support_agent' },
])

const impact = [
  { title: 'Concept-first teaching', text: 'Learn the reason behind every method—not just what to memorise.', icon: 'psychology' },
  { title: 'Exam-ready practice', text: 'Use deliberate repetition and feedback to improve under pressure.', icon: 'task_alt' },
  { title: 'A motivating community', text: 'Progress alongside students who are working toward the same goal.', icon: 'diversity_3' },
]

const scrollTo = (sectionId) => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const scrollToAndClose = (sectionId) => { scrollTo(sectionId); drawer.value = false }
const onContactSubmit = () => {
  $q.notify({ type: 'positive', message: 'Thank you! We will get back to you soon.', position: 'top' })
  contactForm.value = { name: '', email: '', phone: '', message: '' }
}

onMounted(() => { document.documentElement.style.scrollBehavior = 'smooth' })
</script>

<style scoped>
.landing-page { --navy:#0b1f44; --blue:#2563eb; --cyan:#22d3ee; --violet:#7c3aed; --amber:#fbbf24; --coral:#fb7185; --ink:#10213f; --muted:#60708d; background:#f8fbff; color:var(--ink); padding-top:76px; overflow:hidden; }
.page-shell { width:min(1180px, calc(100% - 40px)); margin:0 auto; }
.site-header { height:76px; background:rgba(255,255,255,.9); backdrop-filter:blur(18px); border-bottom:1px solid rgba(37,99,235,.1); box-shadow:0 8px 30px rgba(15,31,68,.06); }
.header-inner { width:min(1240px, calc(100% - 28px)); height:76px; margin:auto; padding:0; gap:10px; }
.brand-wrap { flex:0 0 auto; }.header-logo { height:51px; width:auto; display:block; }
.nav-links { display:flex; gap:3px; margin-left:34px; }.nav-links button,.footer-links button { border:0; background:transparent; cursor:pointer; font:inherit; }.nav-links button { color:#44536f; padding:10px 11px; border-radius:10px; font-weight:600; transition:.2s; }.nav-links button:hover { color:var(--blue); background:#eef5ff; }
.login-btn { color:var(--navy); font-weight:700; }.join-btn,.primary-cta,.form-submit { color:white!important; background:linear-gradient(135deg,var(--blue),var(--violet))!important; box-shadow:0 10px 24px rgba(37,99,235,.24); border-radius:12px; font-weight:700; }.join-btn { padding:3px 12px; }.menu-btn { color:var(--navy); }
.mobile-drawer { background:#f8fbff; }.drawer-brand { display:flex; align-items:center; justify-content:space-between; padding:18px; border-bottom:1px solid #e5ecf8; }.drawer-brand img { height:48px; }.drawer-actions { display:grid; gap:12px; padding:18px; }
.hero-section { min-height:calc(100vh - 76px); position:relative; display:flex; align-items:center; background:radial-gradient(circle at 80% 15%,rgba(34,211,238,.18),transparent 28%),linear-gradient(145deg,#f5f9ff 0%,#eef7ff 48%,#f8f2ff 100%); padding:72px 0 105px; isolation:isolate; }
.hero-grid { display:grid; grid-template-columns:1.08fr .92fr; align-items:center; gap:76px; position:relative; z-index:2; }.eyebrow,.section-kicker { display:inline-flex; align-items:center; gap:8px; color:var(--blue); background:#e8f1ff; border-radius:999px; padding:8px 13px; text-transform:uppercase; letter-spacing:.1em; font-size:.74rem; font-weight:800; }
.hero-copy h1 { margin:22px 0 20px; max-width:690px; color:var(--navy); font-size:clamp(3.25rem,5.5vw,5.3rem); line-height:.98; letter-spacing:-.055em; font-weight:900; }.hero-copy h1 span { background:linear-gradient(110deg,var(--blue),var(--violet) 60%,#d946ef); -webkit-background-clip:text; color:transparent; }.hero-lead { max-width:650px; margin:0; color:var(--muted); font-size:1.16rem; line-height:1.75; }
.hero-actions { display:flex; flex-wrap:wrap; gap:14px; margin:32px 0 36px; }.primary-cta,.secondary-cta { min-height:52px; padding:0 18px; border-radius:14px; font-weight:750; }.secondary-cta { color:var(--navy); border-color:#b9c7df; background:rgba(255,255,255,.72); }
.trust-row { display:flex; gap:0; }.trust-row div { display:grid; gap:2px; padding:0 25px; border-left:1px solid #ccd8e9; }.trust-row div:first-child { padding-left:0; border:0; }.trust-row strong { color:var(--navy); font-size:1rem; }.trust-row span { color:#7a889f; font-size:.78rem; }
.hero-visual { min-height:540px; position:relative; display:grid; place-items:center; }.visual-card { background:rgba(255,255,255,.9); border:1px solid rgba(255,255,255,.95); box-shadow:0 35px 80px rgba(29,61,128,.18); backdrop-filter:blur(12px); }.main-visual-card { width:min(420px,88%); min-height:460px; padding:25px 28px 28px; border-radius:32px; transform:rotate(2deg); }.visual-topline { display:flex; align-items:center; gap:9px; color:#667590; font-size:.82rem; font-weight:700; }.visual-topline .q-icon { margin-left:auto; color:var(--violet); font-size:22px; }.live-dot { width:9px; height:9px; border-radius:50%; background:#22c55e; box-shadow:0 0 0 5px rgba(34,197,94,.12); }
.atom-wrap { width:235px; height:235px; margin:20px auto 10px; position:relative; display:grid; place-items:center; }.atom-core { width:85px; height:85px; border-radius:50%; display:grid; place-items:center; color:white; background:linear-gradient(145deg,var(--blue),var(--violet)); box-shadow:0 18px 35px rgba(99,102,241,.3); }.atom-core .q-icon { font-size:43px; }.orbit { position:absolute; inset:43px 3px; border:2px solid rgba(37,99,235,.23); border-radius:50%; }.orbit i { display:block; width:17px; height:17px; background:var(--cyan); border-radius:50%; position:absolute; top:-8px; left:50%; box-shadow:0 5px 15px rgba(34,211,238,.5); }.orbit-one { transform:rotate(0deg); }.orbit-two { transform:rotate(60deg); border-color:rgba(124,58,237,.2); }.orbit-two i { background:var(--coral); }.orbit-three { transform:rotate(120deg); border-color:rgba(251,191,36,.25); }.orbit-three i { background:var(--amber); }
.hero-photo-wrap { position:relative; height:245px; margin:18px 0 16px; overflow:hidden; border-radius:22px; background:#dbeafe; }.hero-photo { width:100%; height:100%; display:block; object-fit:cover; object-position:center; }.hero-photo-wrap:after { content:''; position:absolute; inset:0; background:linear-gradient(to top,rgba(7,21,47,.4),transparent 58%); }.photo-subject-badge { position:absolute; z-index:2; left:14px; bottom:14px; display:flex; align-items:center; gap:7px; padding:7px 11px; color:white; background:rgba(11,31,68,.78); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.28); border-radius:999px; font-size:.72rem; font-weight:800; }
.main-visual-card h3 { font-size:1.4rem; color:var(--navy); margin:5px 0 20px; text-align:center; }.progress-track { height:9px; background:#e7edf7; border-radius:10px; overflow:hidden; }.progress-track span { display:block; width:92%; height:100%; background:linear-gradient(90deg,var(--cyan),var(--blue),var(--violet)); border-radius:10px; }.visual-metrics { display:flex; justify-content:space-between; margin-top:10px; color:#71809a; font-size:.8rem; }.visual-metrics strong { color:var(--blue); }
.floating-card { position:absolute; z-index:3; display:flex; align-items:center; gap:11px; min-width:205px; background:white; border:1px solid #edf2fa; padding:14px 16px; border-radius:17px; box-shadow:0 18px 40px rgba(24,52,104,.15); }.floating-card .q-icon { width:42px; height:42px; border-radius:13px; display:grid; place-items:center; font-size:23px; }.floating-card div { display:grid; }.floating-card strong { font-size:.84rem; color:var(--navy); }.floating-card span { color:#8090a8; font-size:.7rem; }.floating-card-one { top:68px; left:-5px; transform:rotate(-5deg); }.floating-card-one .q-icon { color:#c47c00; background:#fff4d2; }.floating-card-two { right:-18px; bottom:70px; transform:rotate(4deg); }.floating-card-two .q-icon { color:#7c3aed; background:#f0e9ff; }
.hero-orb { position:absolute; border-radius:50%; filter:blur(2px); opacity:.7; }.hero-orb-one { width:260px; height:260px; right:-90px; top:6%; background:linear-gradient(135deg,rgba(34,211,238,.27),rgba(37,99,235,.08)); }.hero-orb-two { width:180px; height:180px; left:-80px; bottom:10%; background:rgba(251,113,133,.13); }.hero-wave { position:absolute; z-index:1; bottom:-1px; left:0; right:0; height:70px; background:white; clip-path:polygon(0 70%,18% 48%,38% 76%,62% 42%,82% 65%,100% 35%,100% 100%,0 100%); }
.section-block { padding:105px 0; }.section-heading h2,.experience-copy h2,.contact-copy h2 { color:var(--navy); font-size:clamp(2.35rem,4vw,3.65rem); line-height:1.08; letter-spacing:-.04em; margin:18px 0; font-weight:850; }.section-heading p,.experience-copy>p,.contact-copy>p { color:var(--muted); font-size:1.05rem; line-height:1.75; }.centered-heading { max-width:800px; margin:0 auto 48px; text-align:center; }.centered-heading .section-kicker { margin:auto; }.value-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }.value-card { position:relative; min-height:300px; padding:30px; border-radius:25px; background:white; border:1px solid #e8eef8; box-shadow:0 16px 45px rgba(20,48,100,.07); overflow:hidden; transition:.25s; }.value-card:hover { transform:translateY(-8px); box-shadow:0 24px 55px rgba(20,48,100,.13); }.value-card:after { content:''; position:absolute; height:6px; left:0; right:0; bottom:0; background:var(--accent); }.value-card .icon-tile { width:60px; height:60px; border-radius:18px; display:grid; place-items:center; color:var(--accent); background:var(--tint); font-size:30px; }.value-card .card-number { position:absolute; right:24px; top:20px; color:#edf1f8; font-weight:900; font-size:2.7rem; }.value-card h3 { margin:30px 0 12px; color:var(--navy); font-size:1.35rem; }.value-card p { color:var(--muted); line-height:1.75; margin:0; }.accent-1 { --accent:var(--blue); --tint:#e8f1ff; }.accent-2 { --accent:var(--violet); --tint:#f0e9ff; }.accent-3 { --accent:#f59e0b; --tint:#fff4d2; }
.courses-section { background:linear-gradient(140deg,#0a1e43,#122f66); color:white; position:relative; }.courses-section:before { content:''; position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,.12) 1px,transparent 1px); background-size:25px 25px; mask-image:linear-gradient(to bottom,black,transparent); }.courses-section .page-shell { position:relative; }.heading-row { display:grid; grid-template-columns:1.2fr .8fr; align-items:end; gap:70px; margin-bottom:45px; }.heading-row h2 { color:white; margin-bottom:0; }.heading-row>p { color:#b9cae8; margin:0; }.light-kicker { color:#7ee8f8; background:rgba(34,211,238,.12); }.course-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }.modern-course-card { --course:#22d3ee; --courseTint:rgba(34,211,238,.13); min-height:330px; padding:27px; border-radius:22px; border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.07); backdrop-filter:blur(10px); transition:.25s; }.modern-course-card:hover { transform:translateY(-7px); background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.3); }.course-2 { --course:#c4a5ff; --courseTint:rgba(167,139,250,.16); }.course-3 { --course:#fbbf24; --courseTint:rgba(251,191,36,.15); }.course-icon { width:54px; height:54px; display:grid; place-items:center; color:var(--course); background:var(--courseTint); border-radius:16px; font-size:28px; }.course-meta { display:flex; gap:8px; margin:22px 0 13px; }.course-meta span { color:var(--course); background:var(--courseTint); border-radius:99px; padding:5px 9px; font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }.modern-course-card h3 { margin:0 0 10px; font-size:1.28rem; }.modern-course-card p { min-height:80px; color:#b9cae8; line-height:1.65; font-size:.9rem; }.modern-course-card button { border:0; background:transparent; color:white; padding:8px 0; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:7px; }
.teachers-section { position:relative; overflow:hidden; background:linear-gradient(145deg,#f6f9ff,#fff 50%,#f8f4ff); }.teachers-section:before { content:''; position:absolute; width:400px; height:400px; border-radius:50%; left:-220px; bottom:-250px; background:rgba(34,211,238,.12); }.teachers-layout { position:relative; display:grid; grid-template-columns:.72fr 1.28fr; align-items:center; gap:70px; }.teachers-intro h2 { margin:18px 0; color:var(--navy); font-size:clamp(2.4rem,4vw,3.65rem); line-height:1.08; letter-spacing:-.04em; }.teachers-intro>p { color:var(--muted); font-size:1.02rem; line-height:1.75; }.teachers-note { display:flex; align-items:center; gap:11px; margin-top:25px; padding:14px 16px; border:1px solid #dfe9fa; border-radius:15px; color:#5f7397; background:rgba(255,255,255,.75); font-size:.82rem; }.teachers-note .q-icon { color:var(--violet); font-size:23px; }.teacher-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:22px; }.teacher-card { overflow:hidden; border:1px solid #e4ebf6; border-radius:26px; background:white; box-shadow:0 18px 48px rgba(20,48,100,.11); transition:.25s; }.teacher-card:hover { transform:translateY(-7px); box-shadow:0 27px 60px rgba(20,48,100,.17); }.teacher-image-wrap { position:relative; height:350px; overflow:hidden; background:var(--teacher-tint); }.teacher-image-wrap:after { content:''; position:absolute; inset:45% 0 0; background:linear-gradient(transparent,rgba(8,25,58,.58)); }.teacher-image-wrap img { width:100%; height:100%; display:block; object-fit:cover; object-position:center; transition:.4s; }.teacher-card:hover img { transform:scale(1.025); }.chemistry-teacher { --teacher:#db3f84; --teacher-tint:#fff1f6; }.chemistry-teacher .teacher-image-wrap img { object-position:center 42%; }.physics-teacher { --teacher:#e99a17; --teacher-tint:#fff7dc; }.physics-teacher .teacher-image-wrap img { object-position:center 18%; }.teacher-subject { position:absolute; z-index:2; left:18px; bottom:17px; display:flex; align-items:center; gap:7px; padding:8px 13px; border-radius:99px; color:white; background:var(--teacher); font-size:.75rem; font-weight:850; text-transform:uppercase; letter-spacing:.06em; box-shadow:0 8px 20px rgba(5,20,50,.2); }.teacher-details { padding:22px 24px 25px; }.teacher-details>span { color:var(--teacher); text-transform:uppercase; letter-spacing:.09em; font-size:.68rem; font-weight:850; }.teacher-details h3 { margin:6px 0 9px; color:var(--navy); font-size:1.3rem; }.teacher-details p { margin:0; color:var(--muted); line-height:1.6; font-size:.83rem; }
.experience-section { background:white; }.experience-grid { display:grid; grid-template-columns:.95fr 1.05fr; gap:90px; align-items:center; }.feature-list { display:grid; gap:12px; margin-top:30px; }.feature-list>div { display:flex; gap:14px; padding:14px; border-radius:16px; transition:.2s; }.feature-list>div:hover { background:#f5f8fd; }.feature-list>div>span { flex:0 0 47px; height:47px; border-radius:14px; display:grid; place-items:center; color:var(--blue); background:#e8f1ff; font-size:23px; }.feature-list h3 { margin:1px 0 4px; color:var(--navy); font-size:1rem; }.feature-list p { margin:0; color:var(--muted); font-size:.86rem; }.dashboard-preview { padding:16px; border-radius:28px; background:#eaf1fb; box-shadow:0 35px 70px rgba(26,57,116,.18); transform:rotate(1deg); }.preview-header { height:45px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; }.preview-header div { display:flex; gap:6px; }.preview-header div span { width:9px; height:9px; border-radius:50%; background:#fb7185; }.preview-header div span:nth-child(2) { background:#fbbf24; }.preview-header div span:nth-child(3) { background:#22c55e; }.preview-header small { color:#6e7e98; font-weight:700; }.preview-body { min-height:430px; border-radius:20px; background:white; padding:27px; }.preview-welcome { display:grid; color:#8090a8; }.preview-welcome strong { margin-top:5px; color:var(--navy); font-size:1.5rem; }.preview-stats { display:grid; grid-template-columns:1fr 1fr; gap:15px; margin:25px 0; }.preview-stats div { display:grid; gap:5px; padding:20px; border-radius:17px; background:#eff6ff; }.preview-stats div:nth-child(2) { background:#f5f0ff; }.preview-stats .q-icon { color:var(--blue); font-size:25px; }.preview-stats div:nth-child(2) .q-icon { color:var(--violet); }.preview-stats strong { color:var(--navy); }.preview-stats span { color:#8090a8; font-size:.75rem; }.preview-progress { padding:22px; border:1px solid #e8eef8; border-radius:17px; }.preview-progress>div:first-child { display:flex; justify-content:space-between; }.preview-progress span { color:#16a34a; font-size:.75rem; font-weight:800; }.chart-bars { height:130px; display:flex; align-items:end; justify-content:space-around; gap:10px; padding-top:22px; }.chart-bars i { flex:1; height:35%; border-radius:6px 6px 2px 2px; background:#dce8fa; }.chart-bars i:nth-child(2){height:55%}.chart-bars i:nth-child(3){height:44%}.chart-bars i:nth-child(4){height:74%;background:#92b8f8}.chart-bars i:nth-child(5){height:60%}.chart-bars i:nth-child(6){height:86%;background:linear-gradient(var(--cyan),var(--blue))}.chart-bars i:nth-child(7){height:70%}
.preview-photo-wrap { height:150px; position:relative; overflow:hidden; border-radius:15px; margin-bottom:17px; }.preview-photo { width:100%; height:100%; display:block; object-fit:cover; object-position:center 45%; }.preview-photo-wrap:after { content:''; position:absolute; inset:0; background:linear-gradient(to top,rgba(11,31,68,.5),transparent 65%); }.preview-photo-wrap>span { position:absolute; z-index:2; left:11px; bottom:10px; display:flex; align-items:center; gap:6px; color:white; font-size:.72rem; font-weight:800; }
.impact-section { padding:90px 0; background:linear-gradient(125deg,#6d28d9,#2563eb 70%,#0891b2); color:white; }.impact-grid { display:grid; grid-template-columns:.85fr 1.15fr; gap:100px; align-items:center; }.impact-copy h2 { margin:18px 0 0; font-size:clamp(2.7rem,5vw,4.7rem); line-height:.98; letter-spacing:-.05em; }.impact-copy em { color:#ffe07a; font-style:normal; }.impact-points { display:grid; gap:15px; }.impact-points>div { display:flex; align-items:center; gap:17px; padding:18px; border-radius:18px; background:rgba(255,255,255,.11); border:1px solid rgba(255,255,255,.16); }.impact-points .q-icon { flex:0 0 49px; height:49px; border-radius:15px; display:grid; place-items:center; color:#ffe07a; background:rgba(255,255,255,.12); font-size:25px; }.impact-points div div { display:grid; }.impact-points strong { font-size:1rem; }.impact-points span { color:#dddafa; font-size:.85rem; margin-top:3px; }
.contact-section { background:linear-gradient(#f8fbff,#eef4ff); }.contact-panel { display:grid; grid-template-columns:.85fr 1.15fr; overflow:hidden; border-radius:30px; background:white; box-shadow:0 25px 70px rgba(20,48,100,.13); }.contact-copy { padding:48px; color:white; background:radial-gradient(circle at 15% 90%,rgba(34,211,238,.2),transparent 30%),linear-gradient(145deg,#0a1e43,#173d7e); }.contact-copy h2 { color:white; }.contact-copy>p { color:#c0cee4; }.contact-details { display:grid; gap:14px; margin:28px 0; }.contact-details a { display:flex; align-items:center; gap:12px; color:white; text-decoration:none; }.contact-details .q-icon { width:37px; height:37px; border-radius:11px; display:grid; place-items:center; color:#7ee8f8; background:rgba(34,211,238,.12); }.social-row { display:flex; gap:9px; }.social-row .q-btn { color:var(--navy); background:white!important; }.contact-form { padding:48px; }.form-title { display:flex; gap:13px; align-items:center; margin-bottom:25px; }.form-title>.q-icon { width:48px; height:48px; border-radius:14px; display:grid; place-items:center; color:var(--violet); background:#f0e9ff; font-size:24px; }.form-title div { display:grid; }.form-title strong { color:var(--navy); font-size:1.16rem; }.form-title span { color:#8492a8; font-size:.78rem; }.form-row { display:grid; grid-template-columns:1fr 1fr; gap:13px; }.form-submit { width:100%; min-height:50px; }
.site-footer { padding:60px 0 25px; color:#b7c5db; background:#07152f; }.footer-grid { display:grid; grid-template-columns:1fr 1fr 1fr; align-items:center; gap:40px; }.footer-grid img { height:55px; filter:brightness(0) invert(1); }.footer-grid p { margin:10px 0 0; }.footer-links { display:flex; flex-wrap:wrap; gap:13px; justify-content:center; }.footer-links button { color:#b7c5db; }.footer-links button:hover { color:white; }.footer-action { display:flex; align-items:center; justify-content:flex-end; gap:8px; }.footer-action .q-btn { color:#7ee8f8; }.footer-bottom { display:flex; justify-content:space-between; margin-top:38px; padding-top:22px; border-top:1px solid rgba(255,255,255,.1); font-size:.78rem; }
@media (max-width:1023px) { .hero-grid,.experience-grid { gap:35px; }.hero-copy h1 { font-size:3.7rem; }.floating-card-one { left:0; }.floating-card-two { right:0; }.course-grid { grid-template-columns:repeat(2,1fr); }.heading-row { gap:30px; }.teachers-layout { grid-template-columns:1fr; gap:40px; }.teachers-intro { max-width:720px; text-align:center; margin:auto; }.teachers-intro .section-kicker { margin:auto; }.teachers-note { justify-content:center; }.teacher-image-wrap { height:390px; }.experience-grid { grid-template-columns:1fr 1fr; }.contact-panel { grid-template-columns:1fr; }.contact-copy,.contact-form { padding:38px; } }
@media (max-width:767px) { .landing-page { padding-top:68px; }.site-header,.header-inner { height:68px; }.header-logo { height:46px; }.page-shell { width:min(100% - 28px,1180px); }.hero-section { min-height:auto; padding:60px 0 95px; }.hero-grid { grid-template-columns:1fr; gap:32px; }.hero-copy { text-align:center; }.eyebrow { margin:auto; }.hero-copy h1 { font-size:clamp(2.8rem,13vw,4.1rem); }.hero-lead { font-size:1rem; }.hero-actions { justify-content:center; }.trust-row { justify-content:center; }.hero-visual { min-height:455px; }.main-visual-card { min-height:400px; }.atom-wrap { width:200px; height:200px; }.floating-card { min-width:175px; padding:11px; }.floating-card-one { top:30px; }.floating-card-two { bottom:25px; }.section-block { padding:75px 0; }.value-grid,.heading-row,.experience-grid,.impact-grid { grid-template-columns:1fr; }.value-card { min-height:auto; }.heading-row { gap:0; }.course-grid,.teacher-grid { grid-template-columns:1fr; }.modern-course-card { min-height:auto; }.modern-course-card p { min-height:auto; }.teacher-grid { width:min(100%,500px); margin:auto; }.teacher-image-wrap { height:440px; }.experience-copy { text-align:center; }.feature-list { text-align:left; }.dashboard-preview { margin-top:20px; }.impact-grid { gap:35px; }.impact-copy { text-align:center; }.contact-copy,.contact-form { padding:28px 22px; }.form-row { grid-template-columns:1fr; gap:0; }.footer-grid { grid-template-columns:1fr; text-align:center; }.footer-links,.footer-action { justify-content:center; }.footer-bottom { flex-direction:column; align-items:center; gap:8px; } }
@media (max-width:480px) { .hero-copy h1 { font-size:2.75rem; }.hero-actions { display:grid; }.trust-row div { padding:0 11px; }.trust-row strong { font-size:.82rem; }.trust-row span { font-size:.66rem; }.hero-visual { min-height:420px; }.main-visual-card { width:96%; padding:21px; }.floating-card { min-width:155px; }.floating-card-two { right:-6px; }.section-heading h2,.experience-copy h2,.contact-copy h2 { font-size:2.25rem; }.preview-body { min-height:390px; padding:18px; }.preview-stats { gap:8px; }.preview-stats div { padding:14px; }.impact-copy h2 { font-size:3rem; } }
</style>
