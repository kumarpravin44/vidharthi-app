import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";
import { Link } from "react-router-dom";


function SavedAddresses() {

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Pravin Kumar",
      phone: "9876543210",
      address: "Flat 204, Yahavi Vanaha Society, Pune - 411021",
      isDefault: true
    },
    {
      id: 2,
      name: "Pravin Kumar",
      phone: "9876543210",
      address: "Baner Road, Pune - 411045",
      isDefault: false
    }
  ]);

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <>
      <InternalHeader title="Saved Addresses" />
<div className="content" >
      <div className="address-page">

        {addresses.length === 0 ? (
          <div className="empty-address">
            <i className='bx bx-map'></i>
            <p>No saved addresses</p>
          </div>
        ) : (
          addresses.map(address => (
            <div className="address-card" key={address.id}>

              <div className="address-top">
                <h4>{address.name}</h4>

                {address.isDefault && (
                  <span className="default-badge">
                    Default
                  </span>
                )}
              </div>

              <p>📞 {address.phone}</p>
              <p>{address.address}</p>

              <div className="address-actions">
                <button className="edit-btn">
                  <i className='bx bx-edit'></i> Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteAddress(address.id)}
                >
                  <i className='bx bx-trash'></i> Delete
                </button>
              </div>

            </div>
          ))
        )}

      </div>
       </div>

      {/* ➕ Add New Address */}
      <div className="add-address-bar">
        <Link to="/add-address" className="add-address-btn">
          + Add New Address
        </Link>
      </div>
     

      <BottomNav />
    </>
  );
}

export default SavedAddresses;