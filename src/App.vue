<template>
    <AppShell>
        <router-view />
    </AppShell>
</template>

<script>
import AppShell from '@/components/layout/AppShell.vue';

export default {
    name: 'App',
    components: { AppShell }
};
</script>
