package ua.cn.stu.iks.iksmobileclient;

import android.os.AsyncTask;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;


/**
 * Created by darin on 05.01.2017.
 */

public class AccountSignInTask extends AsyncTask<Void, Void, Boolean> {
    private String email;
    private String password;

    AccountSignInTask(String email, String password) {
        this.email    = email;
        this.password = password;
    }

    @Override
    protected Boolean doInBackground(Void... params) {
        // TODO HTTP REQUEST POST /auth and two params in body email and pass for example {email: "111@gmail.com", pass: "123456"}

        try {
            String strUrl = "http://192.168.0.105:8080//auth";

            String strBody = "{email:" + email + "pass:" + password + "}";
            URL url = new URL(strUrl);

            HttpURLConnection conn = (HttpURLConnection ) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);

            conn.setRequestProperty("Content-Length", "" + Integer.toString(strBody.getBytes().length));
            OutputStream os = conn.getOutputStream();

            os.write(strBody.getBytes("UTF-8"));

            conn.connect();

            int responseCode = conn.getResponseCode();
            if(responseCode == 200) {
                System.out.println("Auth successfull");
                // OK read account information {id: "", name: ""}
            } else {
                // BAD
            }

        } catch (Exception exp) {
            exp.printStackTrace();
        }

        return true;
    }
}
