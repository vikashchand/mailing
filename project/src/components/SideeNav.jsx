

import React,{useState} from 'react';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import './SideeNav.css'; // Import the CSS file
import { FaBars } from 'react-icons/fa';
import { FaEnvelope, FaTasks } from 'react-icons/fa';
import {BsFillPeopleFill} from 'react-icons/bs';
import { FcCustomerSupport } from 'react-icons/fc';
import { AiFillHome } from 'react-icons/ai';
import { FiLogOut} from 'react-icons/fi'

const SideeNav = () => {


 // const navigate = useNavigate();
 const [isNavOpen, setIsNavOpen] = useState(false);
  const token = localStorage.getItem('userInfo');
  let decodedToken = jwtDecode(token);
  const role = decodedToken.data[0]?.is_admin;
  console.log(role, 'gg');



  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className={`sidenav-container ${isNavOpen ? 'expanded' : 'minimized'}`}>
    <div className="menu">
      <FaBars className="hamburger-icon" onClick={toggleNav} />
    </div>
    <NavLink to={'/home/LandingPage'}>
    {isNavOpen ? 'Home' : <AiFillHome />}
      
    </NavLink>
          <NavLink to={'/home/about'}>
          {isNavOpen ? 'Send Mail' : <FaEnvelope />}
            
          </NavLink>
          
          {role ==1 && (

            <>
            <NavLink to={'/home/task'}>
            {isNavOpen ? 'Manage templates' : <FaTasks />}
            </NavLink>
            <NavLink to="/home/employees">
            {isNavOpen ? 'Manage Employees' : <BsFillPeopleFill />}
            
            
            
            
            </NavLink>

            </>
          )
        
        
        }

        <NavLink to={'/home/Customers'}>
       
            {isNavOpen ? 'Customer Details' : <FcCustomerSupport/>}

       
          </NavLink>
          
          <NavLink onClick={handleLogout}>
          {isNavOpen ? 'LogOut' : <FiLogOut />}
        </NavLink>


        </div>
  );
};

export default SideeNav;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import './SideeNav.css'; // Import the CSS file

// const SideeNav = () => {
//   const role = 1; // Replace with the actual role value received from token or state

//   return (
//     <div className="sidenav-container">
//       <NavLink to={'/home/about'}>
//         <h1>about u</h1>
//       </NavLink>
      
//       {role === 1 && (
//         <NavLink to={'/home/task'}>
//           <h1>thanks</h1>
//         </NavLink>
//       )}
//     </div>
//   );
// };

// export default SideeNav;
