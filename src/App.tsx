import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cep, setCep] = useState<{ [key: string]: string | undefined }>({});
  const [theme, setTheme] = useState('light');
  const [isResultRetrieved, setIsResultRetrieved] = useState(false);

  const themes = {
    light: 'bg-gray-300 text-black',
    dark: 'bg-gray-800 text-white'
  }

  const fetchCepFromViaCEP = async (cep: string) => {
    const cepPayload = cep.replace(/\D/g, '')
    const cepRegex = /^[0-9]{8}$/
    
    if (cepPayload.length === 0) {
      toast.error('CEP não pode ser vazio!')
      return
    }

    if (!cepRegex.test(cepPayload)) {
      toast.error('CEP inválido!')
      return
    }

    await fetch(`https://viacep.com.br/ws/${cepPayload}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if(!data.erro){
          setCep(data)
          setIsResultRetrieved(true)
        }else{
          toast.error('CEP não encontrado!')
        }
      })
      .catch((error) => {
        toast.error('Erro ao buscar CEP!')
        console.error(error)
      })
  }

  const resetCepResult = () => {
    setCep({})
    setIsResultRetrieved(false)
  }

  return (
    <>
      <div className={`${theme === 'light' ? themes.light : themes.dark} static min-h-screen flex flex-col justify-center align-center`}>
        <button
          className="absolute right-4 top-4 p-2 text-black font-bold rounded-md"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000">
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed">
              <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
            </svg>
          }
        </button>
        <h1 className="text-4xl font-bold font-mono text-center md:text-7xl sm:text-5xl ">Buscador CEP</h1>
        <input
          className="w-2/5 h-12 mx-auto p-2 mt-4 rounded-sm border-black border text-black"
          type="text"
          name="cepInput" 
          id="cep_input_id"
          placeholder="Digite o CEP"
        />
        <div id='container_btn_id'  className="flex flex-col">
          <button
            className="w-60 h-12 mx-auto p-2 mt-4 bg-cyan-500 text-white font-bold rounded-md"
            onClick={() => {
              const cep = (document.getElementById('cep_input_id') as HTMLInputElement).value
              fetchCepFromViaCEP(cep)
            }}
          >
            Buscar!
          </button>
          <button
            className="w-60 h-12 mx-auto p-2 mt-4 bg-cyan-500 text-white font-bold rounded-md"
            onClick={() => resetCepResult()}
          >
            Limpar
          </button>
        </div>
        <div className="w-2/5 mx-auto mt-4 text-justify">
          {
            !isResultRetrieved ? null
            :
            <span className="text-2xl font-bold my-px">Resultado:</span>
          }
          {
            cep &&
            Object.keys(cep).map((key) => (
              <div key={key} className="flex justify-start align-center gap-2">
                <span className="font-bold">{key}:</span>
                <span>{cep[key]}</span>
              </div>
            ))
          }
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
