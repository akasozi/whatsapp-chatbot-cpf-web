package com.kcbgroup.bancassurance.entities;
 
import jakarta.persistence.Column;

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;

import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;

import jakarta.persistence.Table;

import java.io.Serializable;

import lombok.AllArgsConstructor;

import lombok.Builder;

import lombok.Data;
 
@Entity

@Table(name = "BANC_TQ_CLIENTS")

@Data

@Builder

@AllArgsConstructor

public class TQClient implements Serializable {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "TID", nullable = false)

    private Long tid;

    @Column(name = "CLNT_DATE_CREATED")

    private String clntDateCreated;

    @Column(name = "CLNT_CREATED_BY")

    private String clntCreatedBy;

    @Column(name = "CLNT_DOB")

    private String clntDob;

    @Column(name = "CLNT_EMAIL_ADDRS")

    private String clntEmailAddrs;

    @Column(name = "CLNT_GENDER")

    private String clntGender;

    @Column(name = "CLNT_ID_REG_NO")

    private String clntIdRegNo;

    @Column(name = "CLNT_MARITAL_STATUS")

    private String clntMaritalStatus;

    @Column(name = "CLNT_SURNAME")

    private String clntSurname;

    @Column(name = "CLNT_NAME")

    private String clntName;

    @Column(name = "CLNT_OTHER_NAMES")

    private String clntOtherNames;

    @Column(name = "CLNT_PASSPORT_NO")

    private String clntPassportNo;

    @Column(name = "CLNT_PIN")

    private String clntPin;

    @Column(name = "CLNT_PHYSICAL_ADDRS")

    private String clntPhysicalAddrs;

    @Column(name = "CLNT_POSTAL_ADDRS")

    private String clntPostalAddrs;

    @Column(name = "CLNT_PASSWORD")

    private String clntPassword;

    @Column(name = "CLNT_SMS_TEL")

    private String clntSmsTel;

    @Column(name = "CLNT_TITLE")

    private String clntTitle;

    @Column(name = "CLNT_TYPE_NAME")

    private String clntTypeName;

    @Column(name = "CLNT_UPDATE_DT")

    private String clntUpdateDt;

    @Column(name = "CLNT_UPDATED_BY")

    private String clntUpdatedBy;

    @Column(name = "CLNT_WEF")

    private String clntWef;

    @Column(name = "CLNT_COUNTRY_CODE")

    private String clntCountryCode;

    @Column(name = "CLNT_COUNTY_CODE")

    private String clntCountyCode;

    @Column(name = "CLNT_TOWN_CODE")

    private String clntTownCode;

    @Column(name = "CLNTPOSTAL_CODE")

    private String clntpostalCode;

    @Column(name = "CLNT_SECTOR")

    private String clntSector;

    @Column(name = "CLNT_OCCUPATION")

    private String clntOccupation;

    @Column(name = "CLNT_OCCUPATION_NAME")

    private String clntOccupationName;

    @Column(name = "CLNT_BANK_ACCOUNT_NO")

    private String clntBankAccountNo;

    @Column(name = "CLNT_BANK_CODE")

    private String clntBankCode;

    @Column(name = "CLNT_BANK_BRANCH_CODE")

    private String clntBankBranchCode;

    @Column(name = "CLNT_TELEPHONE_NUMBER1")

    private String clntTelephoneNumber1;

    @Column(name = "CLNT_TELEPHONE_NUMBER2")

    private String clntTelephoneNumber2;

    @Column(name = "CLNT_STATUS")

    private String clntStatus;

    @Column(name = "CLNT_WET")

    private String clntWet;

    @Column(name = "CLNT_BRANCH_CODE")

    private String clntBranchCode;

    @Column(name = "CLNT_TYPE")

    private String clntType;

    public TQClient() {

    }

}
 