import React, { useState, useEffect } from 'react'
import "./styles.css"
import { Button, Modal, Icon, Grid, Table, Alert, IconButton, ControlLabel, FlexboxGrid, FormGroup, Loader, FormControl, Form, CheckPicker, Divider,Panel } from 'rsuite';
import API from '../api'
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Produtos(props) {
    const [page, setPage] = useState(1)
    const displayLength = 10
    const [pedidos, setPedidos] = useState([{}])
    const [pedInfo, setPedInfo] = useState({})
    const [info, setInfo] = useState()
    const [checkPick, setCheckPick] = useState([])
    const [produtos, setProdutos] = useState([])
    const [newPedido, setNewPedido] = useState({ "codComanda": "", "produtos": [], "observacao": "" })
    const [pedidoStatus, setPedidoStatus] = useState({ "codComanda": "", "produtos": [], "observacao": "" })
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
        buscaAllProd()
    }, [])

    // abrir e fechar modal de cadastrar pedido 
    function closeAdiciona() {
        setShowAdiciona(false)

    }

    function openAdiciona() {
        setShowAdiciona(true)
        getProdutos()
    }

    // abrir e fechar modal de informações do pedido
    function closeInfo() {
        setShowInfo(false)

    }

    function openInfo() {
        setShowInfo(true)
    }

    // funções da paginação
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
    // busca os produtos do back-end
    async function loadProducts() {
        setLoading(true)
        await API.get("/pedidos/list").then(resultado => {
            setPedidos(resultado.data)
            console.log(resultado.data)
        }).catch(error => {
            console.log(error)
        })
        setLoading(false)
    }

    //cadastrar pedido
    async function cadastra() {
        if (newPedido.produtos.length > 0) {
            closeAdiciona()
            await API.post("/pedidos/", newPedido).then(resultado => {
                console.log(resultado)
            }).catch(error => {
                console.log(error)
            })
            limpaCampos()
            loadProducts()
        } else {
            Alert.error("Selecione pelo menos um Produto")
        }

    }

    function limpaCampos() {
        setNewPedido({ "codComanda": "", "proCod": "", "observacao": "" })
    }

    async function buscaProduto(codPedido) {
        setLoading(true)
        await pedidos.map(pedido => pedido.codPedido == codPedido ? setPedInfo(pedido) : null)
        openInfo()
        setLoading(false)
    }

    async function buscaPedido(pedCod) {
        await API.get(`/pedidos/${pedCod}`).then((resultado) => {
            const aux = resultado.data
            pedidoStatus.codComanda = aux.codComanda
            pedidoStatus.proCod = aux.proCod
            pedidoStatus.observacao = aux.observacao
        }).catch(error => {
            console.log(error)
        })
    }

    // funções de alterar o status do pedido 
    async function finalizar(pedCod) {
        buscaPedido(pedCod)
        await API.put(`/pedidos/${pedCod}/finalizar`, { "codComanda": pedidoStatus.codComanda, "proCod": pedidoStatus.proCod, "observacao": pedidoStatus.observacao }).then(resultado => {
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        loadProducts()
    }

    async function cancelar(codPedido) {
        await buscaPedido(codPedido)
        console.log(pedidoStatus)
        await API.put(`/pedidos/${codPedido}/cancelar`).then(resultado => {
            console.log(resultado)
        }).catch(error => {
            console.log(error)
        })
        loadProducts()
    }

    async function buscaAllProd() {
        setLoading(true)
        await API.get("/produtos/list").then((resultado) => {
            setProdutos(resultado.data)

        }).catch(error => {
            console.log(error)
        })


        setLoading(false)
    }

    function getProdutos() {

        const data = produtos.map(function (produto) {
            const aux = {
                "label": produto.proDesNome,
                "value": produto
            }
            return aux
        })
        // const obj = {"nome":"teste","valor":1}
        // const aux = [{"label": "teste",
        // "value": obj},{"label": "teste2",
        // "value": obj},{"label": "teste3",
        // "value": obj}]
        setCheckPick(data)
    }

    function teste(value) {
        setNewPedido({ ...newPedido, produtos: value })
        console.log(newPedido)
    }

    return (
        <FlexboxGrid justify="center">
            <div id="home">
                <div id="corpo-home">
                <Panel shaded bordered header={<h4>Pedidos</h4>}>
                    <Grid fluid>
                        <Table autoHeight AutoComplete data={data} loading={loading} className='tabela-produtos' appearance="primary" hover={false} >
                            <Column width={50} fixed>
                                <HeaderCell>Info</HeaderCell>
                                <ActionCell dataKey={'codPedido'} icon={'info'} funcao={buscaProduto} />
                            </Column>
                            <Column width={100} fixed>
                                <HeaderCell>ID Pedido</HeaderCell>
                                <Cell dataKey="codPedido" />
                            </Column>

                            <Column width={100} fixed>
                                <HeaderCell>ID Comanda</HeaderCell>
                                <Cell dataKey="codComanda" />
                            </Column>
                            <Column width={100} fixed>
                                <HeaderCell>Status</HeaderCell>
                                <Cell dataKey="statusPedidos" />
                            </Column>
                            <Column width={100} fixed>
                                <HeaderCell>Valor (R$)</HeaderCell>
                                <Cell dataKey="valorTotal" />
                            </Column>
                            <Column width={70} fixed>
                                <HeaderCell>Cancelar</HeaderCell>
                                <ActionCell dataKey={'codPedido'} icon={'ban'} funcao={cancelar} />
                            </Column>
                            <Column width={70} fixed>
                                <HeaderCell>Finalizar</HeaderCell>
                                <ActionCell dataKey={'codPedido'} icon={'check'} funcao={finalizar} />
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
                        <IconButton appearance="primary" icon={<Icon className="fill-color" icon="plus" size="lg" />} size="xs" onClick={openAdiciona}>Novo</IconButton>
                    </Grid>

                    <Modal show={showAdiciona} onHide={closeAdiciona} size="xs">
                        <Form value={newPedido}>
                            <Modal.Header>
                                <Modal.Title>Novo Pedido</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup>
                                    <ControlLabel>Código da Comanda</ControlLabel>
                                    <FormControl type="number" onChange={value => setNewPedido({ ...newPedido, codComanda: value })} />

                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Produtos</ControlLabel>
                                    <CheckPicker style={{ width: 300 }} data={checkPick} onChange={(value) => setNewPedido({ ...newPedido, produtos: value })} />

                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Observações</ControlLabel>
                                    <FormControl type="textarea" onChange={value => setNewPedido({ ...newPedido, observacao: value })} />
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
            <Modal show={showInfo} onHide={closeInfo}>
                <Modal.Header>
                    <Modal.Title>Informação do Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FlexboxGrid justify="start">
                        <FlexboxGrid.Item colspan={12}><h5>Comanda: {pedInfo.codComanda}</h5></FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={12}><h5>Valor: R${pedInfo.valorTotal}</h5></FlexboxGrid.Item>
                    </FlexboxGrid>

                    <Divider />
                    <h5>Observações: </h5>
                    <span>{pedInfo.observacao}</span>
                    <Divider />
                    <h5>Produtos:</h5>
                    {pedInfo.produtos ? pedInfo.produtos.map(produto => <FlexboxGrid>
                        <FlexboxGrid.Item colspan={5}>
                            <dl>
                                <dt>Nome</dt>
                                <dd>{produto.proDesNome}</dd>
                            </dl>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={3}>
                            <dl>
                                <dt>Valor</dt>
                                <dd>R${produto.proValor}</dd>

                            </dl>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={16}>
                            <dl>
                                <dt>Ingredientes</dt>
                                <dd>{produto.proIngrediente}</dd>
                            </dl>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeInfo} appearance="primary">Fechar</Button>
                </Modal.Footer>
                {loading == true ? <Loader backdrop content="Carregando..." center vertical /> : null}
            </Modal>
        </FlexboxGrid>
    );

}