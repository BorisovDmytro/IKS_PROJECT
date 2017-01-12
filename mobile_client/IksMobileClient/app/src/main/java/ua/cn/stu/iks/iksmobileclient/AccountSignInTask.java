package ua.cn.stu.iks.iksmobileclient;

import android.content.Intent;
import android.os.AsyncTask;

import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
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
            String strUrl = "http://192.168.0.101:8080/auth";

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
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                InputStream is = conn.getInputStream();
                byte[] buffer  = new byte[16384];
                int bytesRead;

                while ((bytesRead = is.read(buffer)) != -1) {
                    baos.write(buffer, 0, bytesRead);
                }
                byte[] data = baos.toByteArray();

                String resultString = new String(data, "UTF-8");

                JSONTokener parser = new JSONTokener(resultString);
                JSONObject obj     = (JSONObject) parser.nextValue();

                String id   = obj.getString("id");
                String name = obj.getString("name");

                if(id == null || name == null || id.isEmpty() || name.isEmpty())
                    return false;

                Account account = new Account(id, name);
                AccountService.set(account);
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
