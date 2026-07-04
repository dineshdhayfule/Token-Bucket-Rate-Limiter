package com.dinesh.ratelimiter.model;

import java.util.Objects;

public class ClientIdentifier {

    private final ClientType type;
    private final String value;

    public ClientIdentifier(ClientType type, String value) {
        this.type = Objects.requireNonNull(type);
        this.value = Objects.requireNonNull(value);
    }

    public ClientType getType() {
        return type;
    }

    public String getValue() {
        return value;
    }

    public String getKey() {
        return type.name() + ":" + value;
    }
}