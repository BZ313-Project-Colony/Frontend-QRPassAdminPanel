import React, { useEffect, useState } from 'react';
import { Button, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Spinner } from 'reactstrap';
import "./LoginPage.css";
import adminIcon from "../../assets/images/QRsiyah.svg"
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/MessageModal';
import ApiRequest, { PostApiRequest } from '../../util/ApiRequest';

const LoginPage = () => {
  const { login, logout } = useAuth();
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    logout()
  })

  const onClickLogin = () => {
    if (!username || !password) {
      setError("Boş alan bırakmayınız!")
      return;
    }
    setLoading(true)
    ApiRequest("post", "/auth/login", {
      username: username,
      password: parseInt(password),
    }, (response) => {
      login(response.data.token)
      navigate("/")
    }, (error, code) => {
      setError(`HTTP ${code} - ${error}`)
      setLoading(false)
    })
  }

  return (
    <div className='root'>
      <div className='root_login'>
        <img src={adminIcon} width="200px" />
        <h3 className='title'>Giriş Yap</h3>
        <InputGroup className='inputUsername'>
          <InputGroupText>@</InputGroupText>
          <Input value={username} onChange={(event) => { setUsername(event.target.value) }} placeholder="Kullanıcı Adı" />
        </InputGroup>
        <InputGroup className='inputPassword'>
          <Input type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} placeholder="Şifre" />
        </InputGroup>
        <ErrorModal isOpen={error != null} toggle={() => {
          setError(null)
        }} message={error} />
        {loading ? <Spinner className='buttonLogin' /> : <Button onClick={onClickLogin} className='buttonLogin' color="secondary">Giriş</Button>}
      </div>
    </div>
  );
};

export default LoginPage;