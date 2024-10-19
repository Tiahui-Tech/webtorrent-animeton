const React = require('react');
const { useState, useEffect } = require('react');
const { Divider } = require('@nextui-org/react');
const { dispatch } = require('../../lib/dispatcher');

const useActivateKey = require('../../hooks/useActivateKey');

const Activation = ({ isValid }) => {
    const [activationKey, setActivationKey] = useState('');
    const [isActivated, setIsActivated] = useState(false);
    const { data, isLoading, error, activateKey } = useActivateKey(activationKey);

    const onActivate = () => {
        activateKey();
    };

    useEffect(() => {
        if (data) {
            console.log('Activation successful:', data);
            dispatch('activateKey', data);
            setIsActivated(true);
        }
    }, [data]);

    return (
        <div className="flex flex-col items-center justify-center bg-zinc-900" style={{
            minHeight: 'calc(100vh - 56px)',
        }}>
            <div className="flex flex-col items-center justify-center bg-zinc-950 p-8 rounded-lg">
                <img src="assets/animeton.png" alt="Animeton Logo" className="w-32 h-32 mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-white">{isValid ? '¡Bienvenido a Animeton!' : 'Tu cuenta fue desactivada :('}</h1>
                <p className="text-lg text-gray-300 mb-6 text-center">{isValid ? 'Tu portal al mundo del anime.' : 'Activala de nuevo ingresando otra clave.'}</p>
                <Divider />
                <h2 className="text-2xl font-semibold my-6 text-white">Activación de tu cuenta</h2>
                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Ingresa tu clave de activación"
                        className="w-full px-4 py-2 mb-4 bg-zinc-900 text-white border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        onClick={onActivate}
                        className="relative text-center flex justify-center items-center rounded-full px-8 py-3 bg-white text-black font-bold cursor-pointer hover:bg-opacity-90 transition-all duration-300 w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Activando...' : 'Comenzar mi aventura'}
                    </button>
                    {error && (
                        <p className="text-red-500 mt-2 text-center">{error}</p>
                    )}
                    {isActivated && (
                        <p className="text-green-500 mt-2 text-center">¡Activación exitosa!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

module.exports = Activation;
