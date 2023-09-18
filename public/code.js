document.addEventListener('alpine:init', () => {
    Alpine.data('capstone', () => {
        return {
            show: false,
            log_email: '',
            showSignin: false,
            showSignup: false,
            firstName: '',
            lastName: '',
            role: '',
            email:'',
            password : '',

            init(){
                this.home()
            },

            signUp() {
                
                axios.post('/signup/', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    role: this.role,
                    email: this.email,
                    password : this.password
                })
                .then((res) => {
                    console.log(res.data);
                    this.showSignup= false;
                    this.showSignin=true;

                    setTimeout(() => {
                        this.email = '';
                        this.role = '';
                        this.firstName = '';
                        this.lastName = '';
                    }, 30);
                })
           
                
            },

            signIn() {
                
                axios.post('/signin/', {
                    email: this.email,
                    password : this.password
                })
                .then((res) => {
                    this.home();
                    this.log_email = this.email;
                    this.email = res.data.email;
                    console.log(res.data);
                    console.log(res.data.email);
                    console.log(this.email);
                    this.showSignup = false;
                    // this.showSignin= false;

                })
            },

            home(){
                if(this.email ==''){
                    // this.signIn();
                    this.showSignin = true;
                }else if(this.email !== ' '){
                    this.showSignin = false;
                }
            }
            

        }
    })
})