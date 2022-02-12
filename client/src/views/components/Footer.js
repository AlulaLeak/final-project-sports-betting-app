import '../../styles/Footer.css'
import logo from '../../styles/logoImg/logo.png'

function Footer() {
  return (
    <div className='footer'>
      <img className='logoImg' src={logo} alt='Logo' />
      <p classNamwe="col-md-4 mb-0 text-muted">© 2022 $ayBet,  Inc</p>
    </div>
  )
}

export default Footer
