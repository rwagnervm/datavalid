import React, { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Accordion, AccordionSummary, AccordionDetails, Avatar, Box, Button, CardHeader, Container, Divider, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import request from "request";
import exemplos from "./exemplosCNH"
import imagens from "./imagensCNH"

import logo from "./images/logodatavaliddemo.png"

export default function PfDoc() {
  const [retrato, setRetrato] = useState();
  const [payloadReq, setPayloadReq] = useState();
  const [payloadRes, setPayloadRes] = useState();
  const cleanValues = {
    "cpf": "",
  }
  const [initValues, setInitValues] = useState(cleanValues);

  const inputFile = useRef(null);

  const StyleAccordion = withStyles({
    root: {
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(Accordion);

  const StyleAccordionSummary = withStyles({
    root: {
      padding: 0,
      margin: 0,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(AccordionSummary);

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const updateForm = exemplo => {
    setInitValues(exemplo);
    setRetrato('data:image/jpeg;base64,' + exemplo.documentoFrente);
  }

  const updateRequest = values => {
    setPayloadReq(JSON.stringify({
      "key": {
        "cpf": values.cpf
      },
      "answer": {
        "documento_frente": values.documentoFrente
      }
    }, null, 2))
  }

  const uploadRetrato = async e => {
    if (e.target.files || e.target.files.length > 0) {
      const base64Retrato = await toBase64(e.target.files[0])
      setRetrato(base64Retrato);
      return base64Retrato.split(',')[1]
    }
  }

  const getDV = async () => (new Promise((resolve, reject) => {
    const requestParam = {
      method: 'POST',
      url: 'https://gateway.apiserpro.serpro.gov.br/datavalid-demonstracao/v2/validate/pf-doc',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer 06aef429-a981-3ec5-a1f8-71d38d86481e'
      },
      body: payloadReq
    }

    request(requestParam, (error, response, body) => {
      if (error)
        reject(error)
      else {

        let _body = body;
        try {
          _body = JSON.stringify(JSON.parse(body), null, 2)
        } catch (e) {}

        setPayloadRes('Response Code: '+ response.statusCode +"\n"+ _body)
        resolve(body)
      }
    });
  }));


  return (<Formik enableReinitialize validateOnMount
    initialValues={initValues}
    validate={(values) => {
      const errors = {};
      if (!values.cpf) {
        errors.cpf = 'Informação requerida';
      } else if (
        !/^[0-9]+$/i.test(values.cpf)
      ) {
        errors.cpf = 'CPF deve ser numérico';
      }
      setPayloadRes(null)
      updateRequest(values);
      return errors;
    }}
    onSubmit={async (values, { setSubmitting }) => {
      await getDV(values)
      setSubmitting(false);
    }}
  >
    {({ submitForm, isSubmitting, touched, errors, setFieldValue, isValid}) => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Form>
          <Container component="main" maxWidth="xl">
            <Paper variant="outlined" style={{ padding: 10 }}>
            <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    paddingBottom="10px"
                  >
              <img src={logo} alt="Logo Datavalid" />
              </Box>
              <Grid container spacing={1}>

                <Grid item xs={12} sm={12}>
                  <StyleAccordion defaultExpanded elevation={0} square>
                    <StyleAccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h5">Exemplos</Typography>
                    </StyleAccordionSummary>
                    <AccordionDetails style={{ padding: 0, margin: 0 }}>
                      <Box display="flex" flexWrap="wrap" alignContent="justify" justifyContent="space-between" alignItems="stretch">
                        {
                          exemplos.map((e,i) => <Box key={i} width="230px" padding={1}><CardHeader
                            width="200px" onClick={() => updateForm(e)}
                            style={{ cursor: 'pointer', border: '1px solid black', padding: 0, paddingRight: 10, borderRadius: 5 }}
                            avatar={<Avatar variant="rounded" src={'data:image/jpeg;base64,' + e.thumb} />}
                            title={e.nick} /></Box>)
                        }
                      </Box>

                    </AccordionDetails>
                  </StyleAccordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    Dados Pessoais
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="cpf"
                    type="number"
                    label="CPF"
                    fullWidth
                  />
                </Grid>


                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    Biometria Facial
                  </Typography>
                </Grid>


                <Grid item xs={12} sm={6}>

                  <StyleAccordion style={{ padding: 0, margin: 0 }} elevation={0} square TransitionProps={{ unmountOnExit: true }}>
                    <StyleAccordionSummary style={{ padding: 0, margin: 0 }} expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Escolha uma imagem de exemplo</Typography>
                    </StyleAccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexWrap="wrap">
                        { imagens.map((img, i) => <img spacing={1} alt="" key={i} style={{ cursor: 'pointer' }} src={"data:image/jpeg;base64," + img} width="50px" onClick={() => { setRetrato("data:image/jpeg;base64," + img); setFieldValue('thumb',img)}} />) }
                      </Box>
                    </AccordionDetails>
                  </StyleAccordion>

                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyleAccordion style={{ padding: 0, margin: 0 }} elevation={0} square TransitionProps={{ unmountOnExit: true }}>
                    <StyleAccordionSummary style={{ padding: 0, margin: 0 }} expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Ou envie sua própria imagem</Typography>
                    </StyleAccordionSummary>
                    <AccordionDetails>
                      <input type="file" ref={inputFile} style={{ display: 'none' }} name="retrato" accept="image/*" hidden="" onChange={async (e) =>  setFieldValue('thumb',await uploadRetrato(e))} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => inputFile.current.click()}>
                        Upload
                      </Button>
                    </AccordionDetails>
                  </StyleAccordion>
                </Grid>
                {retrato && <Grid item xs={12} sm={12}><Box display="flex" justifyContent="center" alignItems="center">
                <Field
                    component={TextField} width="400px" alt=""
                    type="hidden"
                    name="documentoFrente" />
                  <img width="200px" alt="Selecione alguma foto" src={retrato} />
                  </Box></Grid>}


                <Grid item xs={12} sm={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    paddingBottom="10px"
                  > <Button
                  variant="contained"
                  color="primary"
                  paddingRight="10px"
                  onClick={() => {setInitValues(cleanValues); setRetrato(null)}}
                >
                  Limpar
                </Button>
                &nbsp;&nbsp;
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                      onClick={submitForm}
                    >
                      Validar
                    </Button></Box>
                  {isSubmitting && <LinearProgress />}
                  <Divider />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyleAccordion defaultExpanded={payloadReq} elevation={0} TransitionProps={{ unmountOnExit: true }}>
                    <StyleAccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h5">Request</Typography>
                    </StyleAccordionSummary>
                    <AccordionDetails style={{ padding: 0, margin: 0 }}>
                      <Typography component="pre" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{payloadReq}</Typography>
                    </AccordionDetails>
                  </StyleAccordion>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <StyleAccordion defaultExpanded={payloadRes} elevation={0} square TransitionProps={{ unmountOnExit: true }}>
                    <StyleAccordionSummary style={{ padding: 0, margin: 0 }} expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h5">Response</Typography>
                    </StyleAccordionSummary>
                    <AccordionDetails style={{ padding: 0, margin: 0 }}>
                      <Typography component="pre" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{payloadRes}</Typography>
                    </AccordionDetails>
                  </StyleAccordion>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Form>
      </MuiPickersUtilsProvider>
    )}
  </Formik>
  )
};