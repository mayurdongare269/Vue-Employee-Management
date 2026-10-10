const {createApp} = Vue;

createApp ({
    data() {
        return {
            userName: "",
            isAuthenticated: false
        };
    },

    methods: {
        async getCurrentUser() {

            const response = await fetch (
                "http://localhost:5283/api/Employee/GetCurrentUser",
                {
                    credentials: "include"
                }
            );

            const result = await response.json();

            //check
            this.userName = result.userName;
            this.isAuthenticated = result.isAuthenticated;
        }
    },

    mounted() {
        this.getCurrentUser();
    }

}).mount("#app");