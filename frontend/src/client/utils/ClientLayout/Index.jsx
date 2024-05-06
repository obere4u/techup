
import Header from '../../components/Header/Index'
import Footer from '../../components/Footer/Index'
import PropTypes from "prop-types"

export default function ClientLayout({children}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

ClientLayout.propTypes = {
  children: PropTypes.element.isRequired
}
