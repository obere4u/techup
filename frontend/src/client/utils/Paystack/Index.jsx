import { useState } from "react";
import { PaystackButton } from "react-paystack";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import axios from "axios";

// import { DONORS_API_URL } from "../API/donorAPI"; //dev API
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Index";
import { PARTNERS_API_URL } from "../../../API/partnerAPI"; // Prod API

const PayButton = ({
  fullName,
  amount,
  email,
  phone,
  currentAddress,
  comment,
  partnershipType,
  organizationName,
  organizationAddress,
  organizationWebsite,
}) => {
  // const publicKey = import.meta.env.VITE_REACT_APP_PAYSTACK_PUBLIC_LIVE_KEY_DEV;
  const publicKey = import.meta.env.VITE_REACT_APP_PAYSTACK_PUBLIC_LIVE_KEY_PROD;

  // eslint-disable-next-line no-unused-vars
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Paystack Success
  const handlePaystackSuccessAction = async (reference) => {
    try {
      setIsLoading(true);

      // Call the DONORS_API_URL to create a new donor
      await axios.post(`${PARTNERS_API_URL}`, {
        fullName,
        email,
        amount,
        phone,
        reference: reference.reference,
        currentAddress,
        comment,
        partnershipType,
        organizationName,
        organizationAddress,
        organizationWebsite,
      });

      navigate("/thank-you");
    } catch (error) {
      console.error("Error processing payment:", error);
      const errorMsg = error.response ? error.response.data : error.message;
      console.log(errorMsg);
      Swal.fire({
        icon: "error",
        text: `Try again`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const componentProps = {
    email,
    amount,
    metadata: {
      fullName,
      phone,
    },
    publicKey,
    text: "Donate",
    onSuccess: (reference) => {
      setReference(reference.reference);
      handlePaystackSuccessAction(reference);
    },
    onClose: () =>
      Swal.fire({
        icon: "error",
        text: "Payment cancelled",
      }),
  };

  return (
    <>
      <PaystackButton
        disabled={!componentProps}
        {...componentProps}
        className="md:w-[15%] mx-auto font-bold py-2 px-4 text-[1.3rem] rounded-md text-white
            bg-blue-600 hover:opacity-80 transition duration-150 ease-in-out focus:outline-none"
      />
      {isLoading && <Spinner />} {/* Render the spinner if isLoading is true */}
    </>
  );
};

PayButton.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  currentAddress: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  partnershipType: PropTypes.string.isRequired,
  organizationName: PropTypes.string.isRequired,
  organizationAddress: PropTypes.string.isRequired,
  organizationWebsite: PropTypes.string.isRequired,
};

export default PayButton;
