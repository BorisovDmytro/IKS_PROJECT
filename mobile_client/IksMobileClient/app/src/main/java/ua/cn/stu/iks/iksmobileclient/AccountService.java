package ua.cn.stu.iks.iksmobileclient;

/**
 * Created by darin on 08.01.2017.
 */

public class AccountService {
    private static Account account = null;

    public static Account get() { return account; }

    public static void set(Account value) { account = value; }
}
