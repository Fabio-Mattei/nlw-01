import React,{useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import './style.css';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../Services/api';
import axios from 'axios';
import Dropzone from '../../Components/Dropzone';

const CreatePoint = () => {
     /**sempre que for criado um estado de um array ou objeto:
     *  deve ser informado manualmente o tipo da váriavel **/
    interface Item{
        id: number;
        title: string;
        image_url: string;    
    }

    interface UF{
        sigla: string;    
    }

    interface Cities{
        nome: string;    
    }

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUFs] = useState<UF[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedUf, setSelecteduf] = useState('0');
    const [selectedCity, setSelectedcity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);    
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);    
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    },[]);

    useEffect(()=> {
        api.get('items').then(response => {
            setItems(response.data);
        });
    },[]);

    useEffect(()=> {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
           setUFs(response.data);
        });
    },[]);

    useEffect(()=> {
        //Carregar as cidades sempre que usuário selecionar a uma UF
        if (selectedUf === '0') {
            return;
        }
    
        axios.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCities(cityNames);           
        });
    },[selectedUf]);

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
      const uf = event.target.value;

      setSelecteduf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedcity(city);
        //console.log(selectedcity);
      }

    function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
        event.latlng.lat,
        event.latlng.lng,
    ])
    }

      
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormData({ ...formData, [name]: value})
    }

    function handleSelectItem(id: number){
        //verifica se o item atual já foi selecionado
        const alreadySelected = selectedItems.findIndex(item => item === id);  
        
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);          
        }        
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile);    
        }
        
        await api.post('points',data);

        alert('Ponto de coleta criado!');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"></img>
                
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile}/>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}></input>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}></input>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}></input>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
                                ))}                                
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
                                <option value="0">Selecione uma cidade</option> 
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}                              
                            </select>
                        </div>
                    </div>                    
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => ( 
                            <li key={item.id} onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title}></img> 
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>                    
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;