import { AES, enc } from 'crypto-js';
import React from 'react';
import styles from './Login.module.css';
import storage from './storage';
import { v4 as uuidv4 } from 'uuid';
import { UserData } from './types';

const STORAGE_KEY_PASSPHRASE = "user";

interface Props {
    setUserData: (userData: UserData) => void;
}

function Login({ setUserData }: Props) {
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [errorText, setErrorText] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const encryptedPassphrase = storage.get<string|undefined>(`${username}:${STORAGE_KEY_PASSPHRASE}`);
        if(!encryptedPassphrase) {
            const passphrase = uuidv4();
            storage.set(`${username}:${STORAGE_KEY_PASSPHRASE}`, AES.encrypt(passphrase, password).toString());
            setUserData({ username, passphrase });
            return;
        }
        const passphrase = AES.decrypt(encryptedPassphrase, password).toString(enc.Utf8);
        if(passphrase) {
            setUserData({ username, passphrase });
        } else {
            setErrorText("Invalid username or password");
        }

    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    return (
        <div className={styles.pageContainer}>
            <form className={styles.loginContainer} onSubmit={handleSubmit}>
                {errorText}
                <label>
                    <div className={styles.labelText}>Username</div>
                    <input name="username" type="text" className={styles.textField} onChange={handleUsernameChange} value={username} />
                </label>
                <label>
                    <div className={styles.labelText}>Password</div>
                    <input name="password" type="password" className={styles.textField} onChange={handlePasswordChange} value={password} />
                </label>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;