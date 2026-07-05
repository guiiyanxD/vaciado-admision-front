<template>
    <div class="app-shell">
        <AppSidebar />
        <main class="app-main">
            <div class="app-main-inner">
                <slot />
            </div>
        </main>
    </div>
</template>

<script>
import AppSidebar from './AppSidebar.vue';

export default {
    name: 'AppShell',
    components: { AppSidebar }
};
</script>

<style scoped>
.app-shell {
    min-height: 100vh;
}

.app-main {
    min-height: 100vh;
}

.app-main-inner {
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
}

@media (min-width: 992px) {
    .app-main {
        margin-left: 260px;
    }
}

@media (max-width: 991.98px) {
    .app-main-inner {
        padding-top: calc(56px + 1.25rem);
    }
}
</style>
