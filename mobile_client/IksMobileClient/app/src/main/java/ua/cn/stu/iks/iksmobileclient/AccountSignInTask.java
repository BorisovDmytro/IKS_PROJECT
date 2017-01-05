package ua.cn.stu.iks.iksmobileclient;

import android.content.Intent;
import android.os.AsyncTask;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by darin on 05.01.2017.
 */

public class AccountSignInTask extends AsyncTask<Void, Void, Boolean> {
    private String email;
    private String password;
    private LoginActivity parent;

    AccountSignInTask(String email, String password, LoginActivity parent) {
        this.email = email;
        this.password = password;
        this.parent = parent;
    }

    @Override
    protected Boolean doInBackground(Void... params) {
        // TODO HTTP REQUEST POST /auth and two params in body email and pass for example {email: "111@gmail.com", pass: "123456"}

        try {
            String strUrl = "http://192.168.0.105:8080/auth";

            String strBody = "email=" + email + "&pass=" + password;
            URL url = new URL(strUrl);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);

            conn.setRequestProperty("Content-Length", "" + Integer.toString(strBody.getBytes().length));
            OutputStream os = conn.getOutputStream();

            os.write(strBody.getBytes("UTF-8"));

            conn.connect();

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                System.out.println("Auth successfull");
                // OK read account information {id: "", name: ""}
                return true;
            }

        } catch (Exception exp) {
            exp.printStackTrace();
        }

        return false;
    }

    @Override
    protected void onPostExecute(final Boolean success) {
        parent.showProgress(false);

        if (success) {
            Intent intent = new Intent(parent, MainActivity.class);
            parent.startActivity(intent);
        } else {
            //parent.getProgressView().setError(parent.getString(R.string.error_incorrect_password));
            parent.getProgressView().requestFocus();
        }
    }

    @Override
    protected void onCancelled() {
        parent.showProgress(false);
    }
}
/*
*  ByteArrayOutputStream baos = new ByteArrayOutputStream();

    if (responseCode == 200) {
        is = conn.getInputStream();

        byte[] buffer = new byte[8192]; // Такого вот размера буфер
        // Далее, например, вот так читаем ответ
        int bytesRead;
        while ((bytesRead = is.read(buffer)) != -1) {
            baos.write(buffer, 0, bytesRead);
        }
        data = baos.toByteArray();
        resultString = new String(data, "UTF-8"); // {id : "String", name: "String"}
        // JsonParser (id, name)

        JSONObject mainObject = new JSONObject(resultString);

        getJsonString("id")

        get
     }
*
* */