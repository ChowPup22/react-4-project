export const toastStyle = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  progress: undefined,
  theme: 'light',
  toastId: 'custom-id-yes',
}

export const toastStyle2 = {
  ...toastStyle,
  toastId: 'custom-id-yes2',
}

export const theme = {
  colorP: '#64b5f6',
  colorPLight: '#9be7ff',
  colorPDark: '#2286c3',
  colorS: '#ff7300',
  colorSLight: '#ffa441',
  colorSDark: '#c44300',
  colorPText: '#000',
  colorSText: '#fff',
}

export const brandBorder = {
  margin: '80px auto 20px 150px',
  width: 'fit-content',
  height: '100px'
}

export const brandHeader = {
  color: theme.colorPLight,
  fontSize: '3rem',
  fontWeight: '700',
  padding: '20px 0',
}

export const brandLogo = {
  width: '100px',
  height: '150px',
  position: 'absolute',
  top: '25px',
  left: '60px',
  borderRadius: '12px',
}

export const headerP = {
  textAlign: 'center',
  color: theme.colorP,
  fontSize: '2rem',
  fontWeight: '600',
}

export const paragraph = {
  fontSize: '1.2rem',
  fontWeight: '400',
  maxWidth: '700px',
  margin: '0 auto',
  textAlign: 'center',
}

export const buttonP = {
  backgroundColor: theme.colorS,
  color: theme.colorSText,
  fontSize: '1.2rem',
  fontWeight: '500',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  margin: '20px auto',
  display: 'block',
}

export const buttonS = {
  backgroundColor: theme.colorS,
  color: theme.colorSText,
  fontSize: '1.2rem',
  fontWeight: '500',
  padding: '6px 10px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  margin: '10px auto',
  display: 'block',
}

export const passToggle = {
  position: 'absolute',
  top: '134px',
  right: '158px',
  color: 'gray',
  cursor: 'pointer',
  fontSize: '28px',
}

export const messageBox = {
  fontSize: '16px',
  color: '#2286c3',
  fontWeight: '500',
  width: '300px',
  border: '2px solid #64b5f6',
  borderRadius: '6px',
  padding: '5px 8px',
}

export const dashboardMessage = {
  fontSize: '18px',
  color: '#2286c3',
  width: '500px',
  fontWeight: '400',
  margin: '5px auto',
}

export const logoutButton = {
  color: '#fff',
  textDecoration: 'none',
  backgroundColor: '#ff7300',
  padding: '3px 5px',
  borderRadius: '5px',
  border: '1px solid transparent',
}

export const link = {
  color: '#fff',
  textDecoration: 'none',
  padding: '12px 20px',
}

export const logoutWrap = {
  position: 'absolute',
  top: '140px',
  right: '10px',
}

export const dashboardWrap = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: '75px',
}