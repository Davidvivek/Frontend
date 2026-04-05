import streamlit as st
import hashlib
from auth.login import get_auth_db

def signup_page():
    st.title("Create New Account")
    
    new_role = st.selectbox("I am a", ["Patient", "Doctor", "Admin"])
    new_name = st.text_input("Full Name")
    new_email = st.text_input("Email Address")
    new_password = st.text_input("Password", type="password")
    
    if st.button("Create Account", key="create_account_btn"):
        if new_email and new_password and new_name:
            db = get_auth_db()
            if db is not None:
                users_collection = db["users"]
                if users_collection.find_one({"email": new_email}):
                    st.error("Email already in use!")
                else:
                    hashed_pw = hashlib.sha256(new_password.encode()).hexdigest()
                    users_collection.insert_one({
                        "name": new_name,
                        "email": new_email,
                        "password": hashed_pw,
                        "role": new_role
                    })
                    st.success("Account created successfully! Please proceed to login.")
            else:
                st.error("Database connection failed")
        else:
            st.error("Please fill in all fields")
            
    if st.button("Back to Login", key="back_to_login_btn"):
        st.session_state.page = "login"
        st.rerun()
