import React from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
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
      showModal: false
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
      return <p>Carregando lista de tarefas, por favor aguarde...</p>;
    }

    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-start tarefa">Tarefa</th>
            <th className="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-start">{item.name}</td>
              <td className="text-end">
                <Button className="editBtn" variant="success" onClick={() => this.getItemData(item.id)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => this.deleteItem(item.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    );
  }

  // Função que renderiza todos os componentes
  render() {
    return (
      <div>

        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar/Editar Tarefa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
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
            <Button variant="primary" type="submit" onClick={this.submitForm}>
              Salvar
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="row">
          <div className="col">
            <h1>Lista de Tarefas</h1>
          </div>
          <div className="text-end col">
            <Button className="addBtn" onClick={this.resetForm}>
              Cadastrar nova tarefa
            </Button>
          </div>
        </div>

        {this.renderTable()}

      </div>
    )
  }
}

export default Items;
