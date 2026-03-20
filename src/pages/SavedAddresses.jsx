import { useState, useEffect } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { addressService } from "../services/addressService";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";
import { Link } from "react-router-dom";


function SavedAddresses() {

  const { setLoading } = useLoader();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const deleteAddress = async (id) => {
    setLoading(true);
    try {
      await addressService.deleteAddress(id);
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setLoading(false);
    }
  };

  const setAsDefault = async (id) => {
    setLoading(true);
    try {
      await addressService.updateAddress(id, { is_default: true });
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })));
    } catch (error) {
      console.error('Failed to set default:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  };

  return (
    <>
      <InternalHeader title="Saved Addresses"  />
<div className="content" >
      <div className="address-page">

        {loadingAddresses ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="empty-address">
            <i className='bx bx-map'></i>
            <p>No saved addresses</p>
          </div>
        ) : (
          addresses.map(address => (
            <div className="address-card" key={address.id}>

              <div className="address-top">
                <h4>
                  <span className="address-label-tag">{address.label}</span>
                </h4>

                {address.is_default && (
                  <span className="default-badge">
                    Default
                  </span>
                )}
              </div>

              <p>{formatAddress(address)}</p>

              <div className="address-actions">
                {!address.is_default && (
                  <button className="edit-btn" onClick={() => setAsDefault(address.id)}>
                    <i className='bx bx-check-circle'></i> Set Default
                  </button>
                )}

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