import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTooltip

} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import axios from "axios";
import { Form, Modal } from "react-bootstrap";
import './Items.css';

class Items extends React.Component {
  constructor(props) {
    super(props);

    // Controle de estados, variáveis globais que definem o comportamento da aplicação
    this.state = {
      isLoading: false,
      error: null,
      id: 0,
      name: '',
      items: [],
      showModal: false,
      showConfirmDialogModal: false
    };
  }

  // Função executada após o documento ser montado
  componentDidMount() {
    this.getItems();
  }

  // Função para listar os itens da lista de tarefas
  getItems() {
    this.setState({ isLoading: true });

    axios
      .get("http://localhost:8000/api/items")
      .then((response) => {
        this.setState({ items: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  }

  // Função para carregar os dados de um item 
  getItemData = (id) => {

    this.setState({ isLoading: true });
    axios
      .get('http://localhost:8000/api/items/' + id)
      .then((response) => {
        const item = response.data;
        this.setState({ id: item.id, name: item.name, isLoading: false });
        this.openModal();
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
        alert("Erro!");
      });

  }

  // Função para deletar items da lista de tarefas
  deleteItem(id) {
    this.setState({ isLoading: true });

    axios
      .delete("http://localhost:8000/api/items/" + id)
      .then((response) => {
        this.setState({ items: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  }

  // Função para cadastrar item na lista de tarefas
  storeItem = (item) => {
    this.setState({ isLoading: true });

    axios
      .post('http://localhost:8000/api/items', item)
      .then((response) => {
        this.setState({ items: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
        alert("Erro!");
      });
  }

  // Função para atualizar item na lista de tarefas
  updateItem = (item) => {
    this.setState({ isLoading: true });

    axios
      .put('http://localhost:8000/api/items/' + item.id, item)
      .then((response) => {
        this.setState({ items: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
        alert("Erro!");
      });
  }

  // Função para submeter formulário de cadastro de item
  resetForm = (event) => {
    this.setState(
      {
        id: 0,
        name: "",
        error: null
      }
    )
    this.openModal();
  }

  // Função que realiza a ocultação do modal
  handleClose = () => {
    this.setState(
      {
        showModal: false
      }
    )
  }

  // Função que realiza a exibição do modal
  openModal = () => {
    this.setState(
      {
        showModal: true
      }
    )
  }

  // Função para submeter formulário de cadastro de item
  submitForm = (event) => {
    event.preventDefault();

    if (this.state.id === 0) {
      const item = {
        name: this.state.name
      };

      this.storeItem(item);
    } else {
      const item = {
        id: this.state.id,
        name: this.state.name
      };

      this.updateItem(item);
    }

    this.handleClose();

  }

  // Função para renderizar tabela de listagem de tarefas
  renderTable() {
    const { items, isLoading, error } = this.state;

    if (isLoading) {
      return <h4>Carregando, por favor aguarde...</h4>;
    }

    if (error) {
      return <p>{error.message}</p>;
    }

    return (

      <CContainer>
        <CTable>
          <CTableHead>
            <CTableRow color="light">
              <CTableHeaderCell scope="col" className="text-start tarefa">Tarefa</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="acoes">Ações</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="text-start">{item.name}</CTableDataCell>
                <CTableDataCell>
                  <CTooltip
                    content="Editar tarefa"
                    placement="left"
                  >
                    <CButton variant="ghost" color='info' className="editBtn" size="sm" onClick={() => this.getItemData(item.id)}><CIcon icon={cilPencil}></CIcon></CButton>
                  </CTooltip>
                  <CTooltip
                    content="Excluir tarefa"
                    placement="right"
                  >
                    <CButton variant="ghost" color="danger" size="sm" onClick={() => this.setState({ showConfirmDialogModal: true, id: item.id })}><CIcon icon={cilTrash}></CIcon></CButton>
                  </CTooltip>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CContainer>

    );
  }

  // Função que renderiza todos os componentes
  render() {
    return (
      <CContainer>

        {/* Modal com formulário de inclusão e edição de tarefa */}
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar/Editar Tarefa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 hidden">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={this.state.id} readOnly={true} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control type="text" placeholder="Digite a descrição da tarefa" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <CButton variant="ghost" color='info' type="submit" onClick={this.submitForm}>
              Salvar
            </CButton>
            <CButton variant="ghost" color='dark' onClick={this.handleClose}>
              Fechar
            </CButton>
          </Modal.Footer>
        </Modal>

        {/* Modal com diálogo de confirmação de exclusão de tarefa */}
        <Modal show={this.state.showConfirmDialogModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza que deseja excluir esta tarefa?
          </Modal.Body>
          <Modal.Footer>
            <CButton variant="ghost" color='danger' onClick={() => {
              this.deleteItem(this.state.id);
              this.setState({ showConfirmDialogModal: false });
            }}>
              Excluir
            </CButton>
            <CButton variant="ghost" color='dark' onClick={() => this.setState({ showConfirmDialogModal: false })}>
              Cancelar
            </CButton>
          </Modal.Footer>
        </Modal>

        {/* Linha com duas colunas, uma com o título do componente e a outra com o botão de novo cadastro */}
        <CRow>
          <CCol>
            <h1>Lista de Tarefas</h1>
          </CCol>
          <CCol className="text-end">
            <CButton variant="ghost" color="info" onClick={this.resetForm}>
              Nova tarefa
            </CButton>
          </CCol>
        </CRow>

        {this.renderTable()}

      </CContainer>
    )
  }
}

// Exporta o componente permitindo que o importe em outros lugares
export default Items;
