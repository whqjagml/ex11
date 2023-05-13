import React, { useState } from 'react'
import {Row, Col, Form, InputGroup, Card,Button} from 'react-bootstrap'
import {app} from '../firebaseInit';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import {getFirestore, doc, setDoc} from 'firebase/firestore'

const JoinPage = ({history}) => {
  const [loading,setLoading] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [form,setForm] = useState({
    email:'pink@inha.com',
    password:'12345678'
  });

  const {email,password} = form;

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }

  const onJoin = () => {
    if (!window.confirm('회원을 등록하시겠습니까?')) return;
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
    .then(async success=> {
        //console.log('success..',success);
        const uid = success.user.uid;
        await setDoc(doc(db, 'user', uid), {
          email : email,
          name : '홍길동',
          address : '인천 미추홀구 용현동',
          phone : '010-1010-1000',
          photo : ''
        });
        history.push('/login');
        setLoading(false);
    })
    .catch(error=>{
        alert('에러 :' + error.message); 
        setLoading(false);
    })
  }

  if (loading) return <h1 className='text-center my-5'>로딩중....</h1>

  return (
    <Row className='justify-content-center my-5'>
      <Col md={5}>
        <h1 className='text-center'>회원등록</h1>
        <Card className='p-3'>
          <Form>
            <InputGroup className='my-2'>
              <InputGroup.Text>이메일</InputGroup.Text>
              <Form.Control value={email}
                onChange={onChange} name="email"/>
            </InputGroup>

            <InputGroup className='my-2'>
              <InputGroup.Text>비밀번호</InputGroup.Text>
              <Form.Control value={password} type="password"
                onChange={onChange} name="password"/>
            </InputGroup>
            <Button 
              onClick={onJoin}
              className='w-100'>회원등록</Button>
              <div className='text-end my-2'>
                  <Link to="/login">로그인</Link>
              </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default JoinPage