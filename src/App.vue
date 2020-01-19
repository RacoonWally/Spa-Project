<template>
    <v-app>
        <v-navigation-drawer
                app
                temporary
                v-model="drawer"
        >
            <v-list>
                <v-list-item
                        :to="link.url"
                        v-for="link of links"
                        :key="link.title"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-{{ link.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title v-text="link.title"></v-list-item-title>
                    </v-list-item-content>

                </v-list-item>
                <v-list-item
                        @click="onLogout"
                        flat
                        v-if="isUserLoggedIn"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-exit_ti_app</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="'Logout'"></v-list-item-title>
                    </v-list-item-content>

                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-toolbar color="primary">
                <v-app-bar-nav-icon
                        @click="drawer= !drawer"
                        class="hidden-md-and-up"
                >

                </v-app-bar-nav-icon>
                <v-toolbar-title>
                    <router-link to="/" tag="span" class="pointer">Ad aplication</router-link>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn
                            color="primary"
                            flat
                            v-for="link in links"
                            :key="link.title"
                            :to="link.url"
                    >
                        <v-icon left>mdi-{{link.icon}}
                        </v-icon>
                        {{link.title}}
                    </v-btn>
                    <v-btn
                            color="primary"
                            flat
                            @click="onLogout"
                            v-if="isUserLoggedIn"
                    >
                        <v-icon left>mdi-exit_to_app
                        </v-icon>
                        Logout
                    </v-btn>
                </v-toolbar-items>

            </v-toolbar>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>

        <template v-if="error">
            <v-snackbar
                    @input="closeError"
                    :color="error"
                    :multi-line="true"
                    :timeout="5000"
                    :vertical="mode === 'vertical'"
                    :value="true"
            >
                {{ error }}
                <v-btn
                        dark
                        flat
                        @click.native="closeError"
                >
                    Close
                </v-btn>
            </v-snackbar>
        </template>

    </v-app>
</template>

<script>


    export default {
        data() {
            return {
                drawer: false
            }
        },
        computed: {
            error() {
                return this.$store.getters.error
            },
            isUserLoggedIn() {
                return this.$store.getters.isUserLoggedIn
            },
            links() {
                if (this.isUserLoggedIn) {
                    return [
                        {title: 'Orders', icon: 'bookmark_border', url: '/orders'},
                        {title: 'New ad', icon: 'note_add', url: '/new'},
                        {title: 'My ads', icon: 'list', url: '/list'},
                    ]
                } else return [
                    {title: 'Login', icon: 'lock', url: '/login'},
                    {title: 'Registration', icon: 'face', url: '/registration'},
                ]
            }
        },
        methods: {
            closeError() {
                this.$store.dispatch('clearError')
            },
            onLogout(){
                this.$store.dispatch('logoutUser')
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>
    .pointer {
        cursor: pointer;
    }
</style>
