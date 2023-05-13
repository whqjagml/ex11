import React, { useState } from 'react'
import {Col, Row, Card, Form, InputGroup,Button} from 'react-bootstrap'
import {app} from '../firebaseInit'
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore'
import { useEffect } from 'react'
import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage'


const MyPage = () => {
  const [loading,setLoading] = useState(false);
  const uid = sessionStorage.getItem("uid");
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [image, setImage] = useState('https://via.placeholder.com/200x200');
  const [file,setFile] = useState(null);

  const [form,setForm] = useState({
    name:'이름',
    phone:'010-0000-0000',
    address:'인천 미추홀구 용현동',
    photo:''
  })

  const {name,phone,address,photo} = form;
  const onChange=(e)=>{
    setForm({
        ...form,
        [e.target.name] : e.target.value
    })
  }
  
  const onChangeFile = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  const getUser = async() => {
    setLoading(true);
    const user = await getDoc(doc(db, 'user', uid));
    console.log(user.data());
    setForm(user.data());
    setImage(user.data().photo? user.data().photo : 'https://via.placeholder.com/200x200');
    setLoading(false);
  }

  useEffect(()=> {
    getUser();
  }, []);

  const onUpdate = async() => {
    if (!window.confirm('정보를 수정하시겠습니까?')) return;
    // file upload
    setLoading(true);
    if (file){
        const sn = await uploadBytes(
            ref(storage, `/photo/${Date.now()}.jpg`), file);
        const url = await getDownloadURL(sn.ref);
        await setDoc(doc(db,'user',uid), {...form, photo:url});
    } else {
        await setDoc(doc(db,'user',uid),form);
    }
    setLoading(false);
    alert('정보가 수정되었습니다.');
  }

  if (loading) return <h1>Loading 중</h1>

  return (
    <Row className='my-5'>
        <Col>
            <h1>회원정보</h1>
            <Card className='p-5'>
                <Form>
                    <InputGroup className='my-2'>
                        <InputGroup.Text >이메일</InputGroup.Text>
                        <Form.Control readOnly value = {sessionStorage.getItem('email')} />
                    </InputGroup>
                    <InputGroup className='my-2'>
                        <InputGroup.Text>이름</InputGroup.Text>
                        <Form.Control onChange={onChange} name="name" value = {name}/>
                    </InputGroup>
                    <InputGroup className='my-2'>
                        <InputGroup.Text>전화번호</InputGroup.Text>
                        <Form.Control onChange={onChange} name="phone" value = {phone}/>
                    </InputGroup>
                    <InputGroup className='my-2'>
                        <InputGroup.Text>주소</InputGroup.Text>
                        <Form.Control onChange={onChange} name="address" value = {address}/>
                    </InputGroup>
                    <div>
                        <img src={image} width="25%" className='my-2'/>
                        <Form.Control onChange={onChangeFile} type="file"/>
                    </div>
                    <div className='text-center my-2'>
                        <Button onClick = {onUpdate}
                            className='px-'>정보수정</Button>
                    </div>
                </Form>
            </Card>
        </Col>
    </Row>
  )
}

export default MyPage