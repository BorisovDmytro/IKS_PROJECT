package ua.cn.stu.iks.iksmobileclient;

/**
 * Created by darin on 05.01.2017.
 */

public class Account {

    private String id;
    private String name;

    Account(String id, String name) {
        this.id   = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
