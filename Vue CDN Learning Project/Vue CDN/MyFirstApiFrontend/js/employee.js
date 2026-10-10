const {createApp} = Vue;

createApp ({
    data() {
        return {
            employees: [],

            employee: {

                // id: "",
                name: "",
                emailAddress: "",
                position: "",
                department: "",
                dob: ""

            },

            isEditing: false,

            message: ""
        };
    },

    methods: {
        async getEmployees() {
            // console.log("getting emp..");
            const response = await fetch(
                "http://localhost:5283/api/Employee/GetAllEmployees",
                {
                    credentials: "include"
                }
            );

            const result = await response.json();
            console.log(result);
            this.employees = result.data;
        } ,
        
        // create employee func
        async createEmployee() {

            try {

                let url = "";
                let method = "";


                if (this.isEditing) {

                    url = "http://localhost:5283/api/Employee/UpdateEmployee";
                    method = "PUT";

                }
                else {

                    url = "http://localhost:5283/api/Employee/CreateEmployee";
                    method = "POST";
                }


                const response = await fetch(
                    url,
                    {

                        method: method,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify( this.employee )
                    }
                );


                const result = await response.json();
                console.log(result);
                this.message = result.message;


                if (result.status) {
                    this.resetForm();
                    await this.getEmployees();
                }

            }
            catch (error) {
                console.error(error);

                this.message = "Operation failed.";
            }
        },


        // helper func to reset 
        resetForm() {

            this.employee = {
                // id: "",
                name: "",
                emailAddress: "",
                position: "",
                department: "",
                dob: ""
            };

            this.isEditing = false;
        },

        // update method
        editEmployee(employee) {
            this.employee = {
                id: employee.id,
                name: employee.name,
                emailAddress: employee.emailAddress,
                position: employee.position,
                department: employee.department,
                dob: employee.dob
            };

            this.isEditing = true;
        },

        //delete..
        async deleteEmployee(id) {
            try {
                const response = await fetch(
                    `http://localhost:5283/api/Employee/DeleteEmployee?id=${id}`,
                    {
                        method: "DELETE",
                        credentials: "include"
                    }
                );

                const result = await response.json();
                this.message = result.message;//

                if(result.status) {
                    await this.getEmployees();
                }

            } catch(error) {
                console.error(error);
            }
        },

        confirmDelete(id) {
            const confimed = confirm("Are you sure ... you want to delete this emp ?");

            if(confimed) {
                this.deleteEmployee(id);
            }
        },


    }
}).mount("#app");