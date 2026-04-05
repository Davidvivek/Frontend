import streamlit as st
import certifi
from pymongo import MongoClient
import hashlib

ca = certifi.where()

@st.cache_resource
def get_auth_db():
    try:
        uri = st.secrets["MONGO_URI"]
        client = MongoClient(uri, tlsCAFile=ca)
        # Verify the connection works
        client.admin.command('ping')
        return client["geriatric_db"]
    except Exception as e:
        st.error(f"Database Initialization Error: {e}")
        return None

def login_page():
    st.title("🏥 MediCare Login")

    role = st.selectbox("Login as", ["Patient", "Doctor", "Admin"])
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if st.button("Login", key="login_btn"):
        if email and password:
            db = get_auth_db()
            if db is not None:
                users_collection = db["users"]
                hashed_pw = hashlib.sha256(password.encode()).hexdigest()
                
                user = users_collection.find_one({
                    "email": email,
                    "password": hashed_pw,
                    "role": role
                })
                
                if user:
                    st.session_state.logged_in = True
                    st.session_state.role = role
                    st.session_state.user_id = str(user["_id"])
                    st.session_state.page = "dashboard"
                    st.rerun()
                else:
                    st.error("Invalid email, password, or role")
            else:
                st.error("Database connection failed")
        else:
            st.error("Please enter email and password")

    st.markdown("Don't have an account?")
    if st.button("Signup", key="goto_signup_btn"):
        st.session_state.page = "signup"
        st.rerun()
