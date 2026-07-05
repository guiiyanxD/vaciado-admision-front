<template>
    <div class="sidebar-nav">
        <div class="sidebar-brand">
            <i class="bi bi-hospital-fill"></i>
            <span>Admisión</span>
        </div>

        <ul class="sidebar-list">
            <li v-for="item in items" :key="item.label" class="sidebar-item">
                <router-link
                    v-if="item.to"
                    :to="item.to"
                    class="sidebar-link"
                    @click="$emit('navigate')"
                >
                    <i :class="['bi', item.icon]"></i>
                    <span>{{ item.label }}</span>
                </router-link>

                <template v-else>
                    <div class="sidebar-group-label">
                        <i :class="['bi', item.icon]"></i>
                        <span>{{ item.label }}</span>
                    </div>
                    <ul class="sidebar-sublist">
                        <li v-for="child in item.children" :key="child.to">
                            <router-link :to="child.to" class="sidebar-sublink" @click="$emit('navigate')">
                                {{ child.label }}
                            </router-link>
                        </li>
                    </ul>
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SidebarNav',
    props: {
        items: { type: Array, required: true }
    },
    emits: ['navigate']
};
</script>

<style scoped>
.sidebar-nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: rgba(255, 255, 255, 0.85);
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.25rem 1.25rem 1rem;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.15rem;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-list {
    list-style: none;
    margin: 0;
    padding: 0.75rem 0.75rem 1.5rem;
    flex: 1;
    overflow-y: auto;
}

.sidebar-item {
    margin-bottom: 0.15rem;
}

.sidebar-link,
.sidebar-sublink {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 0.95rem;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover,
.sidebar-sublink:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #fff;
}

.sidebar-link.router-link-exact-active,
.sidebar-sublink.router-link-exact-active {
    background-color: var(--color-primary);
    color: #fff;
    font-weight: 600;
}

.sidebar-link i {
    font-size: 1.05rem;
    width: 1.25rem;
    text-align: center;
}

.sidebar-group-label {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.9rem 0.85rem 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
}

.sidebar-sublist {
    list-style: none;
    margin: 0;
    padding: 0;
}

.sidebar-sublink {
    padding-left: 2.2rem;
    font-size: 0.9rem;
}
</style>
