import React, { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';
import { Accordion, AccordionSummary, AccordionDetails, Avatar, Box, Button, CardHeader, Container, Divider, Grid, LinearProgress, MenuItem, Paper, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import request from "request";
import exemplos from "./exemplos"
import imagens from "./imagens"

import logo from "./images/logodatavaliddemo.png"

export default function PfFace() {
  const [retrato, setRetrato] = useState();
  const [payloadReq, setPayloadReq] = useState();
  const [payloadRes, setPayloadRes] = useState();
  const cleanValues = {
    "cpf": "",
    "nome": "",
    "sexo": "",
    "data_nascimento": null,
    "tipo_documento": "",
    "nacionalidade": "",
    "situacao_cpf": "",
    "nome_pai": "",
    "nome_mae": "",
    "numero_documento": "",
    "orgao_expedidor": "",
    "uf_expedidor": "",
    "endereco_logradouro": "",
    "endereco_numero": "",
    "endereco_complemento": "",
    "endereco_bairro": "",
    "endereco_cep": "",
    "endereco_municipio": "",
    "endereco_uf": "",
    "cnh_categoria": "",
    "cnh_observacoes": "",
    "cnh_numero_registro": "",
    "cnh_data_primeira_habilitacao": null,
    "cnh_data_validade": null,
    "cnh_data_ultima_emissao": null,
    "cnh_situacao": "",
    "cnh_registro_nacional_estrangeiro": "",
    "cnh_possui_impedimento": ""
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
    setRetrato('data:image/jpeg;base64,' + exemplo.thumb);
  }

  const updateRequest = values => {
    setPayloadReq(JSON.stringify({
      "key": {
        "cpf": values.cpf
      },
      "answer": {
        "nome": values.nome,
        "sexo": values.sexo,
        "nacionalidade": values.nacionalidade,
        "data_nascimento": values.data_nascimento,
        "situacao_cpf": values.situacao_cpf,
        "filiacao": {
          "nome_mae": values.nome_mae,
          "nome_pai": values.nome_pai
        },
        "documento": {
          "tipo": values.tipo_documento,
          "numero": values.numero_documento,
          "orgao_expedidor": values.orgao_expedidor,
          "uf_expedidor": values.uf_expedidor
        },
        "endereco": {
          "logradouro": values.endereco_logradouro,
          "numero": values.endereco_numero,
          "complemento": values.endereco_complemento,
          "bairro": values.endereco_bairro,
          "cep": values.endereco_cep,
          "municipio": values.endereco_municipio,
          "uf": values.endereco_uf
        },
        "cnh": {
          "categoria": values.cnh_categoria,
          "observacoes": values.cnh_observacoes,
          "numero_registro": values.cnh_numero_registro,
          "data_primeira_habilitacao": values.cnh_data_primeira_habilitacao,
          "data_validade": values.cnh_data_validade,
          "registro_nacional_estrangeiro": values.cnh_registro_nacional_estrangeiro,
          "data_ultima_emissao": values.cnh_data_ultima_emissao,
          "codigo_situacao": values.cnh_situacao,
          "possui_impedimento": values.cnh_possui_impedimento ? (values.cnh_possui_impedimento === "1") : undefined
        },
        "biometria_face": values.thumb
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
      url: 'https://gateway.apiserpro.serpro.gov.br/datavalid-demonstracao/v2/validate/pf-face',
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
                <Grid item xs={12} sm={8}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="nome"
                    type="text"
                    label="Nome"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="sexo"
                    label="Sexo"
                    select
                    fullWidth
                  >
                    <MenuItem key="M" value="M">Masculino</MenuItem>
                    <MenuItem key="F" value="F">Feminino</MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="nacionalidade"
                    label="Nacionalidade"
                    select
                    fullWidth
                  >
                    <MenuItem key="1" value="1">Brasileiro</MenuItem>
                    <MenuItem key="2" value="2">Brasileiro Naturalizado</MenuItem>
                    <MenuItem key="3" value="3">Estrangeiro</MenuItem>
                    <MenuItem key="4" value="4">Brasileiro Nascido no Exterior</MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Field component={KeyboardDatePicker} name="data_nascimento" autoOk fullWidth invalidDateMessage="Data Inválida" rules={{ required: false }} InputLabelProps={{ shrink: true }} format="dd/MM/yyyy" label="Data de nascimento" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="situacao_cpf"
                    label="Situacao do CPF"
                    select
                    fullWidth
                  >
                    <MenuItem key="1" value="regular">Regular</MenuItem>
                    <MenuItem key="2" value="cancelada por encerramento de espólio">Cancelada por encerramento de espólio</MenuItem>
                    <MenuItem key="3" value="suspensa">Suspensa</MenuItem>
                    <MenuItem key="4" value="Cancelada por óbito sem espólio">Cancelada por óbito sem espólio</MenuItem>
                    <MenuItem key="5" value="Pendente de regularização">Pendente de regularização</MenuItem>
                    <MenuItem key="6" value="Cancelada por multiplicidade">Cancelada por multiplicidade</MenuItem>
                    <MenuItem key="7" value="nula">Nula</MenuItem>
                    <MenuItem key="8" value="cancelada de oficio">Cancelada de oficio</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    Filiação
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="nome_pai"
                    type="text"
                    label="Nome do Pai"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="nome_mae"
                    type="text"
                    label="Nome da Mãe"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    Documento
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="tipo_documento"
                    label="Tipo de Documento"
                    select
                    fullWidth
                  >
                    <MenuItem key="1" value="1">Carteira de identidade</MenuItem>
                    <MenuItem key="2" value="2">Carteira profissional</MenuItem>
                    <MenuItem key="3" value="3">Passaporte</MenuItem>
                    <MenuItem key="4" value="4">Carteira de reservista</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="numero_documento"
                    type="text"
                    label="Número do documento"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="orgao_expedidor"
                    type="text"
                    label="Órgão Expedidor"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="uf_expedidor"
                    type="text"
                    label="UF Expedidor"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    Endereço
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_logradouro"
                    type="text"
                    label="Logradouro"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_numero"
                    type="text"
                    label="Número"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_complemento"
                    type="text"
                    label="Complemento"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_bairro"
                    type="text"
                    label="Bairro"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_cep"
                    type="text"
                    label="CEP"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_municipio"
                    type="text"
                    label="Município"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="endereco_uf"
                    type="text"
                    label="UF"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" >
                    CNH
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="cnh_categoria"
                    type="text"
                    label="Categoria"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="cnh_observacoes"
                    type="text"
                    label="Observações"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="cnh_numero_registro"
                    type="text"
                    label="Número Registro"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={KeyboardDatePicker} name="cnh_data_primeira_habilitacao" autoOk fullWidth invalidDateMessage="Data Inválida" InputLabelProps={{ shrink: true }} rules={{ required: false }} format="dd/MM/yyyy" label="Data 1a Habilitação" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={KeyboardDatePicker} name="cnh_data_validade" autoOk fullWidth invalidDateMessage="Data Inválida" InputLabelProps={{ shrink: true }} rules={{ required: false }} format="dd/MM/yyyy" label="Data Validade" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field component={KeyboardDatePicker} name="cnh_data_ultima_emissao" autoOk fullWidth invalidDateMessage="Data Inválida" InputLabelProps={{ shrink: true }} rules={{ required: false }} format="dd/MM/yyyy" label="Data Última Emissão" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    name="cnh_registro_nacional_estrangeiro"
                    type="text"
                    label="Registro Nacional de Estrangeiro"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="cnh_situacao"
                    label="Situação"
                    select
                    fullWidth
                  >
                    <MenuItem key="1" value="0">Inexistente</MenuItem>
                    <MenuItem key="2" value="1">emissão autorizada</MenuItem>
                    <MenuItem key="3" value="2">em emissão</MenuItem>
                    <MenuItem key="4" value="3">emitida</MenuItem>
                    <MenuItem key="5" value="4">confirmada</MenuItem>
                    <MenuItem key="6" value="5">modelo antigo</MenuItem>
                    <MenuItem key="7" value="6">alterada</MenuItem>
                    <MenuItem key="8" value="A">cancelada erro detran</MenuItem>
                    <MenuItem key="9" value="B">cancelada erro gráfica</MenuItem>
                    <MenuItem key="0" value="Z">cancelada outros motivos</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField} InputLabelProps={{ shrink: true }}
                    type="text"
                    name="cnh_possui_impedimento"
                    label="Possui Impedimento"
                    select fullWidth
                  >
                    <MenuItem key="1" value="1">Sim</MenuItem>
                    <MenuItem key="2" value="2">Nao</MenuItem>
                  </Field>
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
                    name="thumb" />
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