import React, { useState, useEffect } from 'react'
import "./styles.css"
import { Button, Modal, Icon, Grid, Table, Alert, IconButton, ControlLabel, FlexboxGrid, InputPicker, FormGroup, Loader, Col, FormControl, Form } from 'rsuite';
import API from '../api'
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Produtos(props) {
    const [page, setPage] = useState(1)
    const displayLength = 10
    const [pedidos, setPedidos] = useState([])
    const [produtos, setProdutos] = useState({
        "proCod": "",
        "proDesNome": "",
        "proIngrediente": "",
        "proValor": ""
    })
    const [newPedido, setNewPedido] = useState({ "comCod": "", "proCod": "", "pedMemObs": "" })
    const [pedidoStatus, setPedidoStatus] = useState({ "comCod": "", "proCod": "", "pedMemObs": "" })
    const data = getData()
    const [loading, setLoading] = useState(false)
    const [showAdiciona, setShowAdiciona] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const ActionCell = ({ value, rowData, dataKey, ...props }) => {
        return (
            <Cell {...props} className="link-group">
                <Icon icon={props.icon} size="lg" style={{ cursor: 'pointer' }} onClick={() => { props.funcao(rowData[dataKey]) }} />
            </Cell>
        )
    }

    useEffect(() => {
        loadProducts()
    }, [])

    function closeAdiciona() {
        setShowAdiciona(false)

    }
    function openAdiciona() {
        setShowAdiciona(true)

    }
    function closeInfo() {
        setShowInfo(false)
        setProdutos({
            "proCod": "",
            "proDesNome": "",
            "proIngrediente": "",
            "proValor": ""
        })

    }
    function openInfo() {
        setShowInfo(true)
    }
    async function loadProducts() {
        setLoading(true)
        //const aux = [{ "id": 1, "produtos": "teste", "mesa": 3, "status": 1 }, { "id": 1, "produtos": "teste", "mesa": 2, "status": 1 }, { "id": 1, "produtos": "teste", "mesa": 1, "status": 1 }]
        await API.get("/pedidos/list").then(resultado => {
            setPedidos(resultado.data)
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        setLoading(false)
    }

    function handleChangePage(dataKey) {
        setPage(dataKey)
    }
    function handleChangeLength(dataKey) {
        setPage(1)
        displayLength = dataKey
    }
    function getData() {
        return pedidos.filter((v, i) => {
            const start = displayLength * (page - 1)
            const end = start + displayLength
            return i >= start && i < end
        })
    }

    async function cadastra() {
        closeAdiciona()
        if (newPedido.proCod != "") {
            console.log(newPedido)
            await API.post("/pedidos/", { "comCod": newPedido.comCod, "proCod": newPedido.proCod, "pedMemObs": newPedido.pedMemObs }).then(resultado => {
                console.log(resultado)
            }).catch(error => {
                console.log(error)
            })
            limpaCampos()
            loadProducts()
        } else {
            Alert.error('Campo obrigatório vazio.')
        }

    }

    async function buscaProduto(proCod) {
        openInfo()
        setLoading(true)
        await API.get(`/produtos/${proCod}`).then(async (resultado) => {
            await setProdutos(resultado.data)
        }).catch(error => {
            console.log(error)
        })
        setLoading(false)
    }

    function limpaCampos() {
        setNewPedido({ "comCod": "", "proCod": "", "pedMemObs": "" })
    }

    async function buscaPedido(pedCod) {
        await API.get(`/pedidos/${pedCod}`).then( (resultado) => {
            const aux = resultado.data
            pedidoStatus.comCod = aux.comCod
            pedidoStatus.proCod = aux.proCod
            pedidoStatus.pedMemObs = aux.pedMemObs
            //setPedidoStatus(resultado.data)
        }).catch(error => {
            console.log(error)
        })
        // for (var i = 0; i < pedidos.length; i++) {
        //     if (pedidos[i].pedCod == pedCod) {
        //          return pedidos[i]
        //     }
        // }
    }

    async function finalizar(pedCod) {
        buscaPedido(pedCod)
        await API.put(`/pedidos/${pedCod}/finalizar`, { "comCod": pedidoStatus.comCod, "proCod": pedidoStatus.proCod, "pedMemObs": pedidoStatus.pedMemObs }).then(resultado => {
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        loadProducts()
    }

    async function cancelar(pedCod) {
        await buscaPedido(pedCod)
        console.log(pedidoStatus)
         await API.put(`/pedidos/${pedCod}/cancelar`, { "comCod": pedidoStatus.comCod, "proCod": pedidoStatus.proCod,  "pedMemObs":pedidoStatus.pedMemObs}).then(resultado => {
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        loadProducts() 
    }

    return (
        <FlexboxGrid justify="center">
            <div id="home">
                <div id="corpo-home">
                    <center>
                        <h1>Pedidos</h1>
                    </center>
                    <hr className="my-4"></hr>
                    <Grid fluid>
                        <Table autoHeight AutoComplete data={data} loading={loading} className='tabela-produtos' appearance="primary" hover={false}  rowClassName={pedidos.pedStatus = "CANCELADO" ? "cancelado" : "ativo"}>
                            <Column width={50} fixed>
                                <HeaderCell>Info</HeaderCell>
                                <ActionCell dataKey={'proCod'} icon={'info'} funcao={buscaProduto} />
                            </Column>
                            <Column width={100} align="center" fixed>
                                <HeaderCell>ID Pedido</HeaderCell>
                                <Cell dataKey="pedCod" />
                            </Column>

                            <Column width={100} fixed>
                                <HeaderCell>ID Comanda</HeaderCell>
                                <Cell dataKey="comCod" />
                            </Column>
                            <Column width={120} fixed>
                                <HeaderCell>Status</HeaderCell>
                                <Cell dataKey="pedStatus" />
                            </Column>
                            <Column width={100} fixed>
                                <HeaderCell>Codigo Produto</HeaderCell>
                                <Cell dataKey="proCod" />
                            </Column>
                            <Column width={100} fixed>
                                <HeaderCell>Valor em R$</HeaderCell>
                                <Cell dataKey="pedVlrTotal"/>
                            </Column>
                            <Column width={70} fixed>
                                <HeaderCell>Cancelar</HeaderCell>
                                <ActionCell dataKey={'pedCod'} icon={'ban'} funcao={cancelar} />
                            </Column>
                            <Column width={70} fixed>
                                <HeaderCell>Finalizar</HeaderCell>
                                <ActionCell dataKey={'pedCod'} icon={'check'} funcao={finalizar} />
                            </Column>

                        </Table>
                        <Pagination
                            showLengthMenu={false}
                            activePage={page}
                            displayLength={displayLength}
                            total={pedidos.length}
                            onChangePage={handleChangePage}
                            onChangeLength={handleChangeLength}
                        />
                        <IconButton appearance="primary" icon={<Icon className="fill-color" icon="plus" size="lg" />} size="xs" onClick={openAdiciona}>Adicionar</IconButton>
                    </Grid>

                    <Modal show={showAdiciona} onHide={closeAdiciona} size="xs">

                        <Form onChange={value => setNewPedido(value)} value={newPedido}>
                            <Modal.Header>
                                <Modal.Title>Novo Pedido</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup>
                                    <ControlLabel>Código da Comanda</ControlLabel>
                                    <FormControl name="comCod" type="number" />

                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Código do Produtos</ControlLabel>
                                    <FormControl name="proCod" type="number" />

                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Observações</ControlLabel>
                                    <FormControl name="pedMemObs" type="textarea" />
                                </FormGroup>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button appearance="primary" onClick={() => cadastra()}>Adicionar</Button>
                                <Button onClick={closeAdiciona} appearance="subtle">Cancelar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>
            <Modal show={showInfo} onHide={closeInfo}>
                <Modal.Header>
                    <Modal.Title>Informação do Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={5}>
                            <dl>
                                <dt>Nome</dt>
                                <dd>{produtos.proDesNome}</dd>
                            </dl>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={3}>
                            <dl>
                                <dt>Valor</dt>
                                <dd>R${produtos.proValor}</dd>

                            </dl>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={16}>
                            <dl>
                                <dt>Ingredientes</dt>
                                <dd>{produtos.proIngrediente}</dd>
                            </dl>
                        </FlexboxGrid.Item>

                    </FlexboxGrid>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeInfo} appearance="primary">
                        Fechar
            </Button>
                </Modal.Footer>
                {loading == true ? <Loader backdrop content="Carregando..." center vertical /> : null}
            </Modal>
        </FlexboxGrid>
    );

}


