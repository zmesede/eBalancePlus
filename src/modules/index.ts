import {isAdminAuthenticated, logoutAdmin} from '../services/adminAuth'
import router from "./router";

router.beforeEach((to, from, next) => {

    // quitter admin → logout
    if (from.path.startsWith('/admin') && !to.path.startsWith('/admin')) {
        logoutAdmin()
    }

    // accès admin protégé
    if (to.path.startsWith('/admin') && !isAdminAuthenticated()) {
        return next('/admin/login')
    }

    // F5 hors admin → home
    if (!to.path.startsWith('/admin') && !isAdminAuthenticated()) {
        return next('/')
    }

    next()
})
