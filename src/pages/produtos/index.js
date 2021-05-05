import React, { useState, useEffect } from 'react'
import "./styles.css"
import { Button, Modal, Icon, Grid, Table, Alert, IconButton, ControlLabel, FlexboxGrid, Panel, FormGroup, Loader, Col, FormControl, Form } from 'rsuite';
import API from '../api'
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Produtos(props) {
    const [page, setPage] = useState(1)
    const displayLength = 10

    const [produtos, setProdutos] = useState([])
    const [novoProd, setNovoProd] = useState([{
        "proCod": "",
        "proDesNome": "",
        "proIngrediente": "",
        "proValor": ""
    }])
    const data = getData()
    const [loading, setLoading] = useState(false)
    const [showAdiciona, setShowAdiciona] = useState(false)

    // const ActionCell = ({ value, rowData, dataKey, ...props }) => {
    //     return (
    //         <Cell {...props} className="link-group">
    //             <Icon icon={props.icon} size="lg" style={{ cursor: 'pointer' }} onClick={() => { props.funcao(rowData[dataKey]) }} />
    //         </Cell>
    //     )
    // }

    useEffect(() => {
        loadProducts()
    }, [])

    //abrir e fechar modal de cadastrar produto
    function closeAdiciona() {
        setShowAdiciona(false)

    }

    function openAdiciona() {
        setShowAdiciona(true)

    }
    //funções de paginação
    function handleChangePage(dataKey) {
        setPage(dataKey)
    }

    function handleChangeLength(dataKey) {
        setPage(1)
        displayLength = dataKey
    }

    function getData() {
        return produtos.filter((v, i) => {
            const start = displayLength * (page - 1)
            const end = start + displayLength
            return i >= start && i < end
        })
    }

    //busca produtos do back-end
    async function loadProducts() {
        setLoading(true)
        await API.get("/produtos/list").then(resultado => {
            setProdutos(resultado.data)
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        setLoading(false)
    }

    //função de cadastrar produtos
    async function cadastra() {
        closeAdiciona()
        if (novoProd.proDesNome != "" && novoProd.proIngrediente != "" && novoProd.proValor != "") {
            console.log(novoProd)
            await API.post("/produtos/", { "proDesNome": novoProd.proDesNome, "proIngrediente": novoProd.proIngrediente, "proValor": novoProd.proValor }).then(resultado => {
                console.log(resultado)
            }).catch(error => {
                Alert.error(error)
            })
            loadProducts()
        } else {
            Alert.error('Campo obrigatório vazio.')
        }
    }

    // async function apagarPedido(proCod) {
    //     await API.delete(`/produtos/${proCod}`).then((resultado) => {
    //         console.log(resultado)
    //         Alert.success('Apagado com sucesso!')
    //     }).catch(error => {
    //         console.log(error)
    //     })

    //     loadProducts()
    // }
    return (
        <FlexboxGrid justify="center">
            <div id="home">
                <div id="corpo-home">
                <Panel shaded bordered header={<h4>Produtos</h4>}>
                    <Grid fluid>
                        <Table autoHeight wordWrap AutoComplete data={data} loading={loading} className='tabela-produtos' appearance="primary" hover={false}>
                            <Column width={100} align="center" fixed>
                                <HeaderCell>Id Produto</HeaderCell>
                                <Cell dataKey="proCod" />
                            </Column>

                            <Column width={200} fixed>
                                <HeaderCell>Nome</HeaderCell>
                                <Cell dataKey="proDesNome" />
                            </Column>

                            <Column width={200} fixed >
                                <HeaderCell>Ingredintes</HeaderCell>
                                <Cell dataKey="proIngrediente" />
                            </Column>

                            <Column width={100} fixed>
                                <HeaderCell>Valor (R$)</HeaderCell>
                                <Cell dataKey="proValor" />
                            </Column>
                            {
                                //  <Column width={70} fixed>
                                //  <HeaderCell>Apagar</HeaderCell>
                                //  <ActionCell dataKey={'proCod'} icon={'trash'} funcao={apagarPedido}/>
                                // </Column>
                            }


                        </Table>
                        <Pagination
                            showLengthMenu={false}
                            activePage={page}
                            displayLength={displayLength}
                            total={produtos.length}
                            onChangePage={handleChangePage}
                            onChangeLength={handleChangeLength}
                        />
                        <IconButton appearance="primary" icon={<Icon className="fill-color" icon="plus" size="lg" />} size="xs" onClick={openAdiciona}>Novo</IconButton>
                    </Grid>
                    <Modal show={showAdiciona} onHide={closeAdiciona} size="xs">

                        <Form onChange={value => setNovoProd(value)} value={novoProd}>
                            <Modal.Header>
                                <Modal.Title>Novo Produto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup>
                                    <ControlLabel>Nome do Produto</ControlLabel>
                                    <FormControl name="proDesNome" type="name" />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Ingredientes</ControlLabel>
                                    <FormControl name="proIngrediente" type="textarea" componentClass="textarea" rows={3}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Valor</ControlLabel>
                                    <FormControl name="proValor" type="number"/>
                                </FormGroup>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button appearance="primary" onClick={() => cadastra()}>Adicionar</Button>
                                <Button onClick={closeAdiciona} appearance="subtle">Cancelar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                    </Panel>
                </div>
            </div>
        </FlexboxGrid>
    );

}


