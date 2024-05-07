const fs = require('fs')

const outputPath = './editor/Assets/tmp.json'

const pairs = {
    "languagePairs": [
        {
            "source": "ar",
            "target": "cs",
            "profiles": [
                {
                    "id": "cde18bf3-a0ff-42ec-92bd-147e695f358e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ar",
            "target": "de",
            "profiles": [
                {
                    "id": "078a3f5d-a88a-4341-88a8-0a6dd66b2c41",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ar",
            "target": "en",
            "profiles": [
                {
                    "id": "41cd1507-b1e6-4e6d-9e6f-45d2d7c9a4ee",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "564cabaf-ee71-4953-966c-3aa068ac6287",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c26b7e07-4924-4ea2-bf2d-34dcf1e31c9c",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ar",
            "target": "es",
            "profiles": [
                {
                    "id": "579310d9-c3e4-45de-9bbe-7c085a11afe4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "adbf741b-f368-4cb8-ab77-cd10cfd97627",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ar",
            "target": "fr",
            "profiles": [
                {
                    "id": "ec20c37f-4b23-4ff7-8105-8fc95508aa62",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "bg",
            "target": "en",
            "profiles": [
                {
                    "id": "b368fb9a-f212-48ff-80bf-007b8eea7e62",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "bn",
            "target": "de",
            "profiles": [
                {
                    "id": "9f4948f9-c6b6-47a8-aeee-5e4da14ae52c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "bn",
            "target": "en",
            "profiles": [
                {
                    "id": "41ede6ec-e453-4b53-994f-c3fd5e023068",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "bf347e84-f6e6-4046-a941-f04774c98ae8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "bn",
            "target": "es",
            "profiles": [
                {
                    "id": "cda23770-7139-4911-ac8b-f07c465919f2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "bn",
            "target": "fr",
            "profiles": [
                {
                    "id": "d4e6aca6-f697-4f18-9db6-7fad6ad15f34",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ca",
            "target": "en",
            "profiles": [
                {
                    "id": "1624d058-41c4-4616-a0f1-54bc206c1f9b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "cs",
            "target": "de",
            "profiles": [
                {
                    "id": "815cdf1c-39b2-4a16-a403-5e5122077ad9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "cs",
            "target": "en",
            "profiles": [
                {
                    "id": "31fe6ca7-3321-450f-889c-1819cea0d80b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e2de5a67-d9a8-4e5e-9631-85ae4204ddad",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "cs",
            "target": "es",
            "profiles": [
                {
                    "id": "8871fb2d-0286-449c-973a-dfc8631864a2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "8f327d5d-a7e0-4d92-892f-25feea3e99c0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "cs",
            "target": "fr",
            "profiles": [
                {
                    "id": "20f21253-0066-4e24-a580-5f0361222537",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "da",
            "target": "de",
            "profiles": [
                {
                    "id": "96288ac1-c289-489c-98d6-09bd66e4c31e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "da",
            "target": "en",
            "profiles": [
                {
                    "id": "027e5e39-c23d-4f1b-9575-379cb932f178",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "7635bb13-be28-430b-938a-41759c4864e0",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "da",
            "target": "es",
            "profiles": [
                {
                    "id": "bc080131-3f34-4b66-b073-f6f9eceac529",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "da",
            "target": "fr",
            "profiles": [
                {
                    "id": "37e30665-1435-43e0-84b2-476002223466",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ar",
            "profiles": [
                {
                    "id": "79f2b229-61c9-4a72-b498-b41a7f366c09",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "bn",
            "profiles": [
                {
                    "id": "a216cac2-2b82-40ed-bcbb-803556a7166c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "cs",
            "profiles": [
                {
                    "id": "4940df6b-6c0e-40f3-a118-fb80c9442f96",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "da",
            "profiles": [
                {
                    "id": "58d7cb17-a6a7-4e48-aba3-94b681ae2250",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "el",
            "profiles": [
                {
                    "id": "6f53830b-3c4d-4110-ab38-8b5af1f997f1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a6b2d6df-a8ba-4f11-a02e-7cbe01fba91a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "en",
            "profiles": [
                {
                    "id": "0cef178e-4335-4d61-917c-e3dcdb4427bf",
                    "private": false,
                    "selectors": {
                        "domain": "Industry",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "3a44b304-1aeb-4648-9f69-a6a8f52927b1",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6588e553-084c-4843-b492-e41c19809896",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "8bfeac85-cafa-4eb9-82ad-438724d80368",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a6c92a38-ce20-4e83-8f76-6d11b48bb941",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "aaa4e705-06e9-47b9-b4f6-60b98f8e05e8",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "ae34b2ea-7e09-4139-b8ca-e28ae0a4bb9d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Self",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "es",
            "profiles": [
                {
                    "id": "f92b4765-226a-44f7-8973-4fff2299166c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "et",
            "profiles": [
                {
                    "id": "e911f414-a66f-45b4-8ba1-aa9a446e1856",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "fa",
            "profiles": [
                {
                    "id": "1e95e104-962c-4b2e-a431-1733ba01ff01",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "fi",
            "profiles": [
                {
                    "id": "01f42659-37d9-49d7-836f-64ed216f1b9a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "fr",
            "profiles": [
                {
                    "id": "cb247a29-23a7-4133-aecd-4213af863aa5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ha",
            "profiles": [
                {
                    "id": "78192b58-35b9-46ac-aae4-d023e391ce38",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "he",
            "profiles": [
                {
                    "id": "1ab9d61c-f60b-4322-85d3-e67a45e4d90e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "hi",
            "profiles": [
                {
                    "id": "da86194c-e855-4dce-8831-96a8bab23982",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "hr",
            "profiles": [
                {
                    "id": "7f067d96-5aa8-4c61-b414-f3762df25752",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "hu",
            "profiles": [
                {
                    "id": "427b1869-4664-4b8a-98ea-1858582afb9d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "hy",
            "profiles": [
                {
                    "id": "653d67f4-5c02-465a-a233-1cafa7f48763",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "id",
            "profiles": [
                {
                    "id": "947ba339-3d72-41dc-a7c4-82f3212932c4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "it",
            "profiles": [
                {
                    "id": "652f0465-7abf-47c5-96a2-66219b5c8e9a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ja",
            "profiles": [
                {
                    "id": "fbb26f7c-497a-487c-ae52-1f78154c9210",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ka",
            "profiles": [
                {
                    "id": "a39bee65-a626-459b-934c-d7ec2147b194",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ko",
            "profiles": [
                {
                    "id": "8e8b4491-cb1a-4495-bb9e-0b85f89ba132",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "ddb29927-6d07-4d3d-bb89-dde34bb07f3f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "lt",
            "profiles": [
                {
                    "id": "c980ef02-ca9e-4dcf-887d-d5e789819aa4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "lv",
            "profiles": [
                {
                    "id": "1a93fc06-99dd-4802-bcb0-d37a7fd6181f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "my",
            "profiles": [
                {
                    "id": "b59d9c61-79f3-472b-a0b5-36ed3e4c7e6b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "nl",
            "profiles": [
                {
                    "id": "7bb04871-a832-48d7-a601-74e6fdb43ab2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "no",
            "profiles": [
                {
                    "id": "da5d4d81-d167-471c-8560-a3a26b581826",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "pl",
            "profiles": [
                {
                    "id": "b9279dbe-7643-430a-a1fc-59a1d51a7d78",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ps",
            "profiles": [
                {
                    "id": "d972c72c-990d-4a94-a71d-d81ceada195d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "pt",
            "profiles": [
                {
                    "id": "bf8dfc0a-cca8-4bb7-b504-e961d5533b35",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "da561bc8-ec99-44c4-b69f-3cfa847047a1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ro",
            "profiles": [
                {
                    "id": "e829d3cf-2656-4f17-94b4-59369199c66a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ru",
            "profiles": [
                {
                    "id": "fc3e7ebd-082c-4e8e-94f0-c3c49e3d3248",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "sk",
            "profiles": [
                {
                    "id": "267d404d-73bf-4d32-b6c6-526eedf8b5f9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "sl",
            "profiles": [
                {
                    "id": "17b4c617-5d91-4e22-bf07-42526e6d28b0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "sr",
            "profiles": [
                {
                    "id": "aa3261fd-7ea3-4e82-adbb-249536b25f87",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "sv",
            "profiles": [
                {
                    "id": "783bc035-2679-4495-81a8-f5e41d253900",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "sw",
            "profiles": [
                {
                    "id": "cc360218-3f4d-4514-8b60-3eb29a812615",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ta",
            "profiles": [
                {
                    "id": "df4cc7da-1e66-47ed-8557-cd47ec38605e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "tg",
            "profiles": [
                {
                    "id": "55c755a6-8155-4f95-9a37-ecac9c63da33",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "th",
            "profiles": [
                {
                    "id": "a0ec82bf-29d5-49dc-9a53-826371871955",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "tr",
            "profiles": [
                {
                    "id": "7be7c7a3-c041-42a4-b413-b55567af4549",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "uk",
            "profiles": [
                {
                    "id": "dd394b63-fe1d-480d-881d-20b080d6d2ee",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "ur",
            "profiles": [
                {
                    "id": "fe5fb4b7-545f-44a2-a529-f8b252628ee4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "vi",
            "profiles": [
                {
                    "id": "ddf311a7-93c6-47fe-912e-aa3375b63575",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "zh",
            "profiles": [
                {
                    "id": "0a359d72-a1c4-48e9-8b41-c63177f8b22d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "de",
            "target": "zt",
            "profiles": [
                {
                    "id": "62bc205e-cb2c-4803-9218-2bb410bd78bd",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "el",
            "target": "de",
            "profiles": [
                {
                    "id": "3848b06f-eca7-44f1-bef5-6b10fc23df24",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "el",
            "target": "en",
            "profiles": [
                {
                    "id": "561cb887-7c1c-4e93-a11f-0a1690776568",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "el",
            "target": "es",
            "profiles": [
                {
                    "id": "76685913-c809-4003-80aa-7389621a8e48",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "el",
            "target": "fr",
            "profiles": [
                {
                    "id": "fb176853-100b-4d74-8da0-2f843f6d035b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ar",
            "profiles": [
                {
                    "id": "518af644-4708-460e-b367-6bc3e1f64feb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a2efc0a4-35f9-4d36-82c0-9dd769a83c9c",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "de11f125-6f5d-45a3-aa45-0d93d86d349f",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "bg",
            "profiles": [
                {
                    "id": "d7238386-fe0e-42c6-88b3-55c08a34f2e5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "bn",
            "profiles": [
                {
                    "id": "537b39e3-0233-47b4-af5b-d61b616da361",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "8b41ef44-0925-426a-8e1f-914428ef94e4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ca",
            "profiles": [
                {
                    "id": "40090a58-a1e8-4633-af93-fd40c8e0eaf2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "cs",
            "profiles": [
                {
                    "id": "32e871bd-c82f-4b36-a59f-7cfd109a606e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "4c02852a-54f4-4c26-81c1-271c71fea810",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "da",
            "profiles": [
                {
                    "id": "1c7a0620-b2f6-4aa0-8347-0f564893fa96",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "2f83862d-3496-4415-8a87-ba1fd3429891",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "61c29b83-a822-4544-bb48-24c7782fa8d9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "de",
            "profiles": [
                {
                    "id": "02a604ba-d5b4-45a5-87b8-d334b5c0d227",
                    "private": false,
                    "selectors": {
                        "domain": "Industry",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "3903a1a6-2918-4824-b5a4-b68976ba6896",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "670f5235-a620-4d47-8aa2-3450f4356c55",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "753872bb-5202-497e-841b-b4159b86e7c2",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "837b77a3-ae41-4429-bd77-3f6574c54ce2",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "el",
            "profiles": [
                {
                    "id": "e4f9f626-cc47-425f-9722-bbc7249bc06f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "es",
            "profiles": [
                {
                    "id": "176b164d-47d1-4e13-bf3c-4e3247fac803",
                    "private": false,
                    "selectors": {
                        "domain": "Generic_Loca_LATAM",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "76c710c0-0ef5-4059-b260-499037620921",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "857697d1-8471-4aa1-9f02-e77c936b8f18",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "abacf18b-2d20-4094-a86a-6f931a190433",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "cef6d1d1-9361-4e4b-b9cd-c7d592f538cd",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "et",
            "profiles": [
                {
                    "id": "23c1d61d-939f-4f27-9246-56ba6063f665",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "7100d14d-bf27-4b4d-907a-6c31fc52225e",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "fa",
            "profiles": [
                {
                    "id": "50294047-895c-4937-8008-97bfee21c118",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "fi",
            "profiles": [
                {
                    "id": "17f24234-8115-4fee-ad25-b67347c35ee6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "fr",
            "profiles": [
                {
                    "id": "5a091697-4a12-4bbd-8660-ab471422541a",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6c6fee43-08b0-4e0e-8458-fe0b0f15e4b8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic_TX_loca_CA",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a9708b5e-7a05-43e5-af91-d21d78dc6906",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b6ead001-d7a3-49eb-a3c5-8f6205dc3d17",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "de2803ac-84b0-4c38-b539-f007ac8bd417",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e7fbc597-973a-4c00-9f31-edade318240d",
                    "private": false,
                    "selectors": {
                        "domain": "Legal",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ha",
            "profiles": [
                {
                    "id": "51fe4be9-9469-4fb5-9376-27cc3b1c09fb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "he",
            "profiles": [
                {
                    "id": "057ce1fe-1310-4bdc-8ffb-1e1909ce0ca0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "3cce28af-b824-4661-917f-cbf07c78939a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "hi",
            "profiles": [
                {
                    "id": "ece72804-51c5-4231-a9b7-6e3534c2fc0c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "hr",
            "profiles": [
                {
                    "id": "1631bac0-6caa-479c-9fe2-06bd597e3236",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "815eb352-b83a-448b-b322-91a14d5edcf3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "ce31ddac-4273-471e-95e1-9f460f26d385",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "hu",
            "profiles": [
                {
                    "id": "bee9a523-34e9-4338-b1cd-867d0254f765",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "hy",
            "profiles": [
                {
                    "id": "768b93f1-3f54-4f80-afba-17042e427f46",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "id",
            "profiles": [
                {
                    "id": "c9a459f3-859b-44e9-8cc7-017bf8308adc",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "it",
            "profiles": [
                {
                    "id": "22e4acc5-80b1-4941-9f75-88254b1b869f",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "49dbd94c-0dda-49af-b14a-cfe96b4fa2bf",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6c476a22-89d2-4aa7-b166-e11b93464fb6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "ea13fb01-06a4-4fc7-8059-0138f1e322c9",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ja",
            "profiles": [
                {
                    "id": "197ba484-e0f3-4a7e-8a75-5b609e9cd3e9",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c7058a35-bce3-4baa-9a39-febe617048f6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ka",
            "profiles": [
                {
                    "id": "c1ea2b34-d590-4baf-a734-8687bb4dd6d1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ko",
            "profiles": [
                {
                    "id": "0bf36ed0-ce86-4424-ac91-4fe740b0d575",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "29afa533-b206-4e95-9d48-8ceca2b2a7ac",
                    "private": false,
                    "selectors": {
                        "domain": "Legal",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "710a1753-f448-471e-a6e6-7d6e00131ec9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b9dd4950-2c58-4c7c-8c10-912dfc28bdcc",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c969d10b-3629-4d52-9216-f68c712f617e",
                    "private": false,
                    "selectors": {
                        "domain": "Customs",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "lt",
            "profiles": [
                {
                    "id": "39176770-224a-4b00-b570-b6b33f49dc33",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "lv",
            "profiles": [
                {
                    "id": "000237b6-5ee8-438a-a96c-78e3e48b3ba5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e0c87bc9-ac7a-42d2-a903-62bff0d4b485",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ms",
            "profiles": [
                {
                    "id": "0349f8ce-2943-4898-9740-663cb6be2c5f",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6710a7c3-2f1d-438c-866e-b6af6ba708f3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "my",
            "profiles": [
                {
                    "id": "5a48d595-4c2f-4108-9c2a-7773785e0fbd",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "nl",
            "profiles": [
                {
                    "id": "45b34f74-7d46-4671-9ac3-71412becd11e",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c1aaca2c-b7a1-43aa-a7ec-159e1df77aa6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "no",
            "profiles": [
                {
                    "id": "fb7505f5-a23a-4192-87cd-3e67ac2e8492",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "pa",
            "profiles": [
                {
                    "id": "809ee88a-fadb-4df2-90d8-3a451aa5337f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "pl",
            "profiles": [
                {
                    "id": "23d58455-5bcf-41a0-bb06-7a8c4ab3489c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "f9be34cf-c7e1-4aba-918f-c5457a7e4196",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ps",
            "profiles": [
                {
                    "id": "8a5b41b5-7ea8-46b4-9442-61f42e2aed18",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "pt",
            "profiles": [
                {
                    "id": "632f2fc1-516e-4d57-b9d6-be802ff7a893",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "67b70358-d4d3-4058-9665-071e1a4757ed",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6f3328af-e36f-496f-8d95-38b69b8e2685",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "75b5b64f-fddc-4403-a178-5642f752d80a",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "f0c63ed8-5833-4a11-a964-e6342a65b2f8",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "fcb5f933-2614-4b8c-87ec-f332d1a344bf",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ro",
            "profiles": [
                {
                    "id": "23b787d5-2d66-4779-8f8f-92d9afb532c7",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ru",
            "profiles": [
                {
                    "id": "1d58d073-88fd-4d97-8b23-65ea6c9f4d78",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "29157b33-4b32-4116-b9a6-54c13f3ae665",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "5198081b-8f03-4618-a28e-80c3e3b51061",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "dd1e01d8-87e3-484f-9aed-fc0344e9ba88",
                    "private": false,
                    "selectors": {
                        "domain": "Energy",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sk",
            "profiles": [
                {
                    "id": "ae00cfb7-22c3-44ad-ad6c-f696fcf30971",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sl",
            "profiles": [
                {
                    "id": "3de05a29-e6f6-4474-8f23-c4153faf2c1b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d68afe51-c598-4ed1-9fbe-7ec7dfc1142d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "so",
            "profiles": [
                {
                    "id": "899a9af8-1719-42aa-918a-a1b75db81431",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sq",
            "profiles": [
                {
                    "id": "6fae495d-37f6-4df4-b1bb-7c326e27bc71",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sr",
            "profiles": [
                {
                    "id": "0361a2bb-7c37-4e29-8b41-4ebd85c29449",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "09a18082-4cc7-45fb-90a1-a3865d6b3fa9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a719cb1d-6771-4e7b-9543-a52cffd87944",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d7e6120a-9747-4e1c-82fa-2997ef094292",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sv",
            "profiles": [
                {
                    "id": "7302dbca-daf1-4ea1-917b-c917be615906",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b46f6786-aad9-41f3-99ba-23e6cbb1a42b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "sw",
            "profiles": [
                {
                    "id": "33cfe337-6fa4-47f4-b929-fb3b6d24857c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ta",
            "profiles": [
                {
                    "id": "fd88d471-68e0-4d67-8700-ccb7d30e71e6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "tg",
            "profiles": [
                {
                    "id": "eb29b952-1d85-4cb5-92cb-af4a323b54ec",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "th",
            "profiles": [
                {
                    "id": "547532fd-1260-460a-8295-366c4720cb25",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b83aff02-0806-475d-a5be-59dfd52a0938",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "tl",
            "profiles": [
                {
                    "id": "99b6ee97-927b-4ee6-bea2-559aea5ebe69",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "tr",
            "profiles": [
                {
                    "id": "83da5987-409d-456d-a999-1640ca87f6c3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "uk",
            "profiles": [
                {
                    "id": "fb039ab3-74c8-422d-ac8c-f4fdd5a6c323",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "ur",
            "profiles": [
                {
                    "id": "8d3a13a1-ea98-4a60-8b43-6debbf492356",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "edee8647-4321-49e9-a9aa-3e6a5eaf23bb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "vi",
            "profiles": [
                {
                    "id": "72d0bc64-6c88-4873-98ed-d2b95fe4c101",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "zh",
            "profiles": [
                {
                    "id": "03eeb6f7-f9b7-427a-b386-dbc9f00e3b15",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "3e548457-7b43-423a-ab04-833bd485342c",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "71596336-14ff-4142-bd84-940831ef17b6",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "722598ec-a744-4c67-bf65-a4aac9fa75ff",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b0efa13a-6cfd-42d1-b545-c90f205cd78c",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "en",
            "target": "zt",
            "profiles": [
                {
                    "id": "140ef45d-5fab-43dd-af32-c4b6f5928c59",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "bb37b7cc-e439-474b-86da-058769e95bd5",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ar",
            "profiles": [
                {
                    "id": "8ba5e0d4-abf3-4266-b4ea-788917dffb84",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "bn",
            "profiles": [
                {
                    "id": "58e6987f-df9c-445d-8e21-c8bbcc8e0f21",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "cs",
            "profiles": [
                {
                    "id": "81f4013b-093f-435c-91f9-df700d6054ee",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "da",
            "profiles": [
                {
                    "id": "f98d68e5-99e9-4e36-8354-b64a4af32084",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "de",
            "profiles": [
                {
                    "id": "8c012055-e0c7-4b2e-8561-b8c6e626050c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a1308066-c3ee-4220-8856-0021677de026",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "el",
            "profiles": [
                {
                    "id": "793438db-b0a8-436e-a586-68a61836bb1c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "en",
            "profiles": [
                {
                    "id": "4a88990a-5bc6-485c-aba8-c34f10f25b6f",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "4adabffd-3879-4cb0-af46-aacb3cf840c1",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a6d4d228-842c-4aef-a1f0-0115c0abf734",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e46ea8e6-39c8-4fa0-835c-dc3628a610b2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "et",
            "profiles": [
                {
                    "id": "98aa0b31-9933-408d-8443-d6781ade3f17",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "fa",
            "profiles": [
                {
                    "id": "463489bc-635b-4982-b6f6-db9de2bfd54b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "fi",
            "profiles": [
                {
                    "id": "70b364b2-cf6e-4d59-b0d4-83ea90d2881a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "fr",
            "profiles": [
                {
                    "id": "0428657a-44b7-4f01-84ad-675e2d5d19df",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ha",
            "profiles": [
                {
                    "id": "f4185ffb-c706-4ccf-aa7e-d8ffb28b9ab5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "he",
            "profiles": [
                {
                    "id": "2018747a-21a8-4970-8ef3-b97c87c2de3d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "hi",
            "profiles": [
                {
                    "id": "e881d199-0441-4748-bc70-fc01ee29e457",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "hr",
            "profiles": [
                {
                    "id": "d8dfc534-2f15-4cf8-9592-785a1d2ff837",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "hu",
            "profiles": [
                {
                    "id": "81c7d2ee-14c8-4a24-816f-48f62499fec1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "hy",
            "profiles": [
                {
                    "id": "051e29bb-95d9-4063-806a-9565b6143a9c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "id",
            "profiles": [
                {
                    "id": "6de18d63-e828-455f-b9d6-ef3b40c37f77",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "it",
            "profiles": [
                {
                    "id": "0231843b-d5bc-4c3d-943e-b0651d2690b3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6f826dbb-c0f1-4832-b36c-5c6a89df2ffe",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ja",
            "profiles": [
                {
                    "id": "33d30e82-b542-4472-9aeb-fd06cde338e6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ka",
            "profiles": [
                {
                    "id": "41e4c8ff-963a-4625-8c6d-8a38c36e5bb1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ko",
            "profiles": [
                {
                    "id": "54f2d164-1d36-4a3a-ac99-8fcbbd0fc095",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "lt",
            "profiles": [
                {
                    "id": "be3ff074-2b27-4d32-a60c-12daebaed2c6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "lv",
            "profiles": [
                {
                    "id": "33c40049-6655-45df-9d0d-f41add5a5ee0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "my",
            "profiles": [
                {
                    "id": "6d73f5fd-4806-42a2-8242-25a319ec62cd",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "nl",
            "profiles": [
                {
                    "id": "f0a0d8e9-1ad6-42c4-bd59-17f3d5996f60",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "no",
            "profiles": [
                {
                    "id": "034c0de7-2902-4716-b75f-39b7e593a79f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "pl",
            "profiles": [
                {
                    "id": "ef536b7d-f366-4b50-81e9-377dc87adaf6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ps",
            "profiles": [
                {
                    "id": "c6324211-76bb-4d94-902c-b866c44142fd",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "pt",
            "profiles": [
                {
                    "id": "a26fba32-3723-466e-afde-2a931f53da73",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ro",
            "profiles": [
                {
                    "id": "3e2a41a9-3650-4150-8c01-8f07f9b577d2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ru",
            "profiles": [
                {
                    "id": "ff799dbe-5563-4da8-a25d-ae99df37fc19",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "sk",
            "profiles": [
                {
                    "id": "e6e1f1ab-6c1c-45d2-8ae0-e47c51967926",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "sl",
            "profiles": [
                {
                    "id": "d42faabe-73c8-4dd4-89dd-5194d0caeab5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "sr",
            "profiles": [
                {
                    "id": "654bb93e-c8f7-4a57-ad75-e4720e129b3f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "sv",
            "profiles": [
                {
                    "id": "58e7bff3-ef3b-4af8-938f-68461a41f798",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "sw",
            "profiles": [
                {
                    "id": "f916443a-57cb-4fa8-8eaa-d3cbdd1f5d92",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ta",
            "profiles": [
                {
                    "id": "4ba3014d-bc40-40f2-a44c-9684ffc7f5d3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "tg",
            "profiles": [
                {
                    "id": "8116f677-7b8d-457d-adb4-d9618cab1766",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "th",
            "profiles": [
                {
                    "id": "21e508dc-2153-42c0-b9a5-66b223b07ed3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "tr",
            "profiles": [
                {
                    "id": "7a9452ae-7260-4590-a55c-8b4a4b4328cb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "uk",
            "profiles": [
                {
                    "id": "cf38cd44-b791-4c31-ac32-f33807dc664c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "ur",
            "profiles": [
                {
                    "id": "22a9b5e4-153c-445b-a334-6d09627de2f2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "vi",
            "profiles": [
                {
                    "id": "e8a2b730-e78f-4e47-80dd-ce48a1869857",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "zh",
            "profiles": [
                {
                    "id": "c552e321-15dc-4a2d-b41d-4ac8539bb9bc",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "es",
            "target": "zt",
            "profiles": [
                {
                    "id": "79afe4a1-941a-494c-9a86-65da000e233d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "et",
            "target": "de",
            "profiles": [
                {
                    "id": "cd763b3c-1cbc-43cb-a42e-94f04598b998",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "et",
            "target": "en",
            "profiles": [
                {
                    "id": "17be125b-1367-4328-b963-5b3dbe8da1e4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b5ac6490-7aff-4adf-a836-bacb557738e3",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "et",
            "target": "es",
            "profiles": [
                {
                    "id": "777bf0ec-96bb-4264-93ba-a1c8c45cf697",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e35e36ff-37e0-4f89-893a-0562df8eaa87",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "et",
            "target": "fr",
            "profiles": [
                {
                    "id": "dc0fad5a-4e2f-45ef-bb4d-21bb8a0c6613",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fa",
            "target": "de",
            "profiles": [
                {
                    "id": "07c7b4d3-5d4f-4362-92f0-38cc26e8bc2d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fa",
            "target": "en",
            "profiles": [
                {
                    "id": "1b2ce4a4-3e49-42fb-9869-b41738f34d5c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fa",
            "target": "es",
            "profiles": [
                {
                    "id": "ee6dd04a-e041-498c-ab07-b16342a66cf8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fa",
            "target": "fr",
            "profiles": [
                {
                    "id": "b0a24886-ee84-4e1e-be0c-ec33e848a72a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fi",
            "target": "de",
            "profiles": [
                {
                    "id": "44c81860-1411-4e91-81c7-f08c373c6804",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fi",
            "target": "en",
            "profiles": [
                {
                    "id": "43ec31d3-dcdf-48f1-9775-4d73e1064e88",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fi",
            "target": "es",
            "profiles": [
                {
                    "id": "6211430a-4b07-40cf-9429-588fe3bbdb37",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fi",
            "target": "fr",
            "profiles": [
                {
                    "id": "298222ff-27d7-41c2-9706-4afaf40381a5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ar",
            "profiles": [
                {
                    "id": "b39b98fd-d085-447d-81bb-4dd785ca775e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "bn",
            "profiles": [
                {
                    "id": "8f83a52c-654d-4ac6-a43e-ad889cd21ea2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "cs",
            "profiles": [
                {
                    "id": "b99b5a4b-3eee-4b3b-800c-1cd8de265fe7",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "da",
            "profiles": [
                {
                    "id": "22992286-b6fa-49f1-bb66-6fc917c17f37",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "de",
            "profiles": [
                {
                    "id": "af00b33b-d347-4b01-bf5e-0f62d2f6e8ae",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "el",
            "profiles": [
                {
                    "id": "e965b28d-3101-4344-ae69-73918f66ed36",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "en",
            "profiles": [
                {
                    "id": "0fd7ac83-071b-45e0-b9e4-a0267581dfb7",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "62d487be-f921-4265-b5a3-f0022e14a2d9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic_TX_loca_CA",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6cd81079-2d59-4e3a-9c21-bba9f774b367",
                    "private": false,
                    "selectors": {
                        "domain": "Dialog",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "71a96631-0d5d-4439-8754-62be08dc2556",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "8493f652-9137-464e-b97c-a353a10bade5",
                    "private": false,
                    "selectors": {
                        "domain": "Energy",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b2e41cd5-c698-483f-b381-d035ab195a31",
                    "private": false,
                    "selectors": {
                        "domain": "Legal",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c8e4d975-fd9f-41d3-b139-abdcf8601166",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d24e369d-b3f3-4182-94ad-9280e796e2fc",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "es",
            "profiles": [
                {
                    "id": "9dfcabf3-07fb-442d-9c3d-db33a44f6d23",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "et",
            "profiles": [
                {
                    "id": "f20d51bd-fac2-4f73-abf8-a9d0e3602482",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "fa",
            "profiles": [
                {
                    "id": "5aac413a-f420-463e-ae61-03a9df2c576f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "fi",
            "profiles": [
                {
                    "id": "4a5d899b-b9a4-48b7-83fe-012e742c772d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ha",
            "profiles": [
                {
                    "id": "90065bbc-b559-41ca-96bb-cf1ec4877a40",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "he",
            "profiles": [
                {
                    "id": "cec7cf82-db6e-44e2-aeda-738e8750f659",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "hi",
            "profiles": [
                {
                    "id": "62fd93de-b3f6-4b48-a7ce-e741599c7871",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "hr",
            "profiles": [
                {
                    "id": "58846ec4-baa2-4eba-afa2-6a24c23271c8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "hu",
            "profiles": [
                {
                    "id": "29160bc6-221e-45f5-9d51-132a5ef2f839",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "hy",
            "profiles": [
                {
                    "id": "7fc34706-6b06-4a27-a4d7-90a1d094e366",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "id",
            "profiles": [
                {
                    "id": "c8681b11-a0ef-4235-a88f-82f4212e86ea",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "it",
            "profiles": [
                {
                    "id": "35c59030-dda3-4a04-820e-9ef09a2dcf21",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ja",
            "profiles": [
                {
                    "id": "ecc1e7d7-4b93-47b8-a8a5-56668b8073f8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ka",
            "profiles": [
                {
                    "id": "a70314a0-2268-4f34-a53c-94ece9e147db",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ko",
            "profiles": [
                {
                    "id": "bf44f903-9849-4084-aec3-38bd0140a445",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "lt",
            "profiles": [
                {
                    "id": "5c83e591-c103-4386-91cc-b5aef3bfce61",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "lv",
            "profiles": [
                {
                    "id": "89b1e5d2-fd69-49a0-b109-fc73ecab5257",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "my",
            "profiles": [
                {
                    "id": "73a73642-ab4e-49ed-95d5-0ab8449d980f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "nl",
            "profiles": [
                {
                    "id": "fa1aaabe-5748-4b50-9ffe-5f83c241d03b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "no",
            "profiles": [
                {
                    "id": "e544bd83-f13e-4811-a430-051e4f9a3ba3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "pl",
            "profiles": [
                {
                    "id": "e59dc704-1de0-4b1b-962e-a8c90a7b0497",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ps",
            "profiles": [
                {
                    "id": "ae8b0fa5-4db9-4d1e-a0f0-d3a95f9b5e61",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "pt",
            "profiles": [
                {
                    "id": "49533767-4f21-4f52-8c9f-7b5f5c994b02",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e9c7521b-1c51-477e-af86-785fdddcfe0e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ro",
            "profiles": [
                {
                    "id": "d0904730-12f6-4a58-8fe8-f800d98fb886",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ru",
            "profiles": [
                {
                    "id": "c6bf825e-8b1b-4cb7-87ac-1ccec4e8d805",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "sk",
            "profiles": [
                {
                    "id": "324792aa-4e04-4650-a0ad-936999494b16",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "sl",
            "profiles": [
                {
                    "id": "4dc9ac0f-24bc-4969-8aad-ff7094e238df",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "sr",
            "profiles": [
                {
                    "id": "55c773f8-19b7-4ad8-8f51-6c97ebc28eeb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "sv",
            "profiles": [
                {
                    "id": "1b0757d0-2c93-496a-b8a6-cf24459a3362",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "sw",
            "profiles": [
                {
                    "id": "0ff9f30d-d537-4656-91f5-acf684098656",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ta",
            "profiles": [
                {
                    "id": "75195145-d03b-43a2-a01f-334bc9bc0310",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "tg",
            "profiles": [
                {
                    "id": "8ea9f5e6-ea2d-4227-aeca-37a53759a71a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "th",
            "profiles": [
                {
                    "id": "57490378-4364-4ff9-9390-8a0d8ff06dd4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "tr",
            "profiles": [
                {
                    "id": "ed4a2344-040a-48e2-bdfa-c9747dc44068",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "uk",
            "profiles": [
                {
                    "id": "d88c31c7-0b32-4df0-8477-5c2dd84887d8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "ur",
            "profiles": [
                {
                    "id": "482fc317-f743-4840-847f-6a7286f952ea",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "vi",
            "profiles": [
                {
                    "id": "033a3d3a-19c0-457c-af72-a5425bb3fd11",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "zh",
            "profiles": [
                {
                    "id": "ebde247d-6b29-4a26-a3da-451777faef55",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "fr",
            "target": "zt",
            "profiles": [
                {
                    "id": "a850ff05-6119-446a-8067-bf5981448b15",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ha",
            "target": "de",
            "profiles": [
                {
                    "id": "ae4db6fb-961a-424c-ba6d-81edb82aff98",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ha",
            "target": "en",
            "profiles": [
                {
                    "id": "3b03e1e1-da10-4726-8e60-884549eb272d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ha",
            "target": "es",
            "profiles": [
                {
                    "id": "d1ef773c-d738-429a-bfcc-929740e78d07",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d3647acf-604f-4f82-82a9-7a4cd60333d6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ha",
            "target": "fr",
            "profiles": [
                {
                    "id": "76cab0d6-9d3f-471b-8ead-baff6b49c00c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "he",
            "target": "de",
            "profiles": [
                {
                    "id": "56d0e560-7f48-4424-9153-c22ead2c06de",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "he",
            "target": "en",
            "profiles": [
                {
                    "id": "0a7a9360-9b77-4add-843b-ebeb436a61b1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "6e2f5c4e-e127-461c-bbe9-18dbe61b3772",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "he",
            "target": "es",
            "profiles": [
                {
                    "id": "02bae57a-bd6f-47da-ad04-744955d23faa",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "he",
            "target": "fr",
            "profiles": [
                {
                    "id": "0ccda4e5-e22a-4478-9045-f89493825f42",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hi",
            "target": "de",
            "profiles": [
                {
                    "id": "8a169ba8-a41a-4b3d-9065-354553ad0053",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hi",
            "target": "en",
            "profiles": [
                {
                    "id": "67d30ade-3bc0-4836-8778-46b6601b05b2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic_Multi_Scripts",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "bc00cd3e-fa58-48cd-8ab0-b4fd47164d79",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hi",
            "target": "es",
            "profiles": [
                {
                    "id": "5d92476a-dc47-4a51-950b-e4a1888d286a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hi",
            "target": "fr",
            "profiles": [
                {
                    "id": "45406f83-36e4-4052-8521-b34a3bd833be",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hr",
            "target": "de",
            "profiles": [
                {
                    "id": "2b578136-10ef-4b08-bdcb-ae728f973361",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hr",
            "target": "en",
            "profiles": [
                {
                    "id": "05f8eb3d-0e0e-4cce-84ff-9cb4c3cc382a",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "84e9dfe1-7fef-48ce-8aa0-2eea6999c8e8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b2c60777-7aaf-41bf-8749-996fcb0e3914",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hr",
            "target": "es",
            "profiles": [
                {
                    "id": "05e35a1d-88f0-45b5-ac3c-4c00cad597f1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hr",
            "target": "fr",
            "profiles": [
                {
                    "id": "02522ca1-351a-48a0-a75a-4bf284168da2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hu",
            "target": "de",
            "profiles": [
                {
                    "id": "731d7a58-5b3f-4b4e-87e0-b602b744b8a6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hu",
            "target": "en",
            "profiles": [
                {
                    "id": "c7261816-a78a-4c2b-b8af-8285a5bf5c71",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hu",
            "target": "es",
            "profiles": [
                {
                    "id": "a73e5584-eb2b-4b1b-a562-d1af673457c4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hu",
            "target": "fr",
            "profiles": [
                {
                    "id": "42990fe8-381f-4a34-a259-1f1636b27090",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hy",
            "target": "de",
            "profiles": [
                {
                    "id": "cec8d8c8-0a58-4c7f-840b-8df978ca48cb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hy",
            "target": "en",
            "profiles": [
                {
                    "id": "26d42d4f-f357-4a9f-939b-43a2674ce366",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hy",
            "target": "es",
            "profiles": [
                {
                    "id": "459b4a5b-9301-46a1-97b0-3d550650bf71",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "7f48fb30-dab7-4e17-874c-53f34d47caa5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "hy",
            "target": "fr",
            "profiles": [
                {
                    "id": "a9e78011-0c51-4ba3-a8ab-cf2d1c78a23a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "id",
            "target": "de",
            "profiles": [
                {
                    "id": "317913fd-690f-4090-872e-2d814e77f299",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "id",
            "target": "en",
            "profiles": [
                {
                    "id": "ceda4a79-5975-410b-95af-8d55efdf9974",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "id",
            "target": "es",
            "profiles": [
                {
                    "id": "f37218c2-70d1-4195-a810-d52793cc8276",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "id",
            "target": "fr",
            "profiles": [
                {
                    "id": "6a85a036-f22f-442c-84d3-e5e110da0f91",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "id",
            "target": "ko",
            "profiles": [
                {
                    "id": "5af63d6f-ec4c-4b76-9bb6-01b2b61757c0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "it",
            "target": "de",
            "profiles": [
                {
                    "id": "938c2e4d-fd02-42c2-96de-bef1cb361118",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Self",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "it",
            "target": "el",
            "profiles": [
                {
                    "id": "25c48a55-e45b-46c5-8cb6-89cba5199f21",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "it",
            "target": "en",
            "profiles": [
                {
                    "id": "4256af91-1423-4531-bc93-410cff231455",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "5a1e1257-0797-4506-90fa-107287bde16f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "991e99b3-84c8-4c71-bf23-984e5e8b86f6",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "a4a55e15-42bf-46e2-9548-db6c80b9e015",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "it",
            "target": "es",
            "profiles": [
                {
                    "id": "01289100-f82b-4722-a1fd-a6db73137dc0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "30fdbb58-9ec7-4507-b6f1-d6ec837efa2b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "ac730c73-1aaf-4829-b4c3-1e11b255dfb1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "it",
            "target": "fr",
            "profiles": [
                {
                    "id": "4273b645-3855-4940-b5df-052684954ce9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ja",
            "target": "de",
            "profiles": [
                {
                    "id": "846529bf-bca8-4c90-ac95-b35ce96c06d8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ja",
            "target": "en",
            "profiles": [
                {
                    "id": "89ede4b3-b7a1-4a5a-af64-fe1d82422b86",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "95e5694a-b612-4842-8bd7-cdea9cd6c0e2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ja",
            "target": "es",
            "profiles": [
                {
                    "id": "11d51f37-8c50-4211-bb2a-60fc18d5eb28",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ja",
            "target": "fr",
            "profiles": [
                {
                    "id": "52c44c0f-ccf2-4621-8376-47a2e5e509e2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ja",
            "target": "ko",
            "profiles": [
                {
                    "id": "6bbda286-eeb9-42a1-beba-1433d365a8f0",
                    "private": false,
                    "selectors": {
                        "domain": "Customs",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "930e19bf-5d28-4abd-a0d6-6c76ef538b7b",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d282ae81-962f-43a2-a7eb-210d1132dbb2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ka",
            "target": "de",
            "profiles": [
                {
                    "id": "89906ffb-6cf1-4898-9aab-a3baec04a34c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ka",
            "target": "en",
            "profiles": [
                {
                    "id": "40434873-cc52-4575-8b30-4244f01a282d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ka",
            "target": "es",
            "profiles": [
                {
                    "id": "9ff0b025-046e-48a5-a3e2-28d4c2992212",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ka",
            "target": "fr",
            "profiles": [
                {
                    "id": "6c4a2476-e6ef-4322-8a8d-f3ec6e5db20d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "de",
            "profiles": [
                {
                    "id": "00271978-3e0b-402d-b176-c13776869605",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "f3fe7b63-5bcc-4c3e-abff-094fe261c4b8",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "en",
            "profiles": [
                {
                    "id": "01c28335-7f0f-45af-933e-62f7fb92bd2f",
                    "private": false,
                    "selectors": {
                        "domain": "Customs",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "5511bcde-ea8e-4564-9d5b-bc59b827593c",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "9048f124-52c8-4eaf-85f2-535a0ff1356f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "f2901c19-a2d4-4eac-bd36-f461aaa8ca37",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "es",
            "profiles": [
                {
                    "id": "9b94d5a7-f150-4e7a-a49f-f8f8a93329f0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e23e6d96-17b6-4676-8a7a-8322066565f3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "fr",
            "profiles": [
                {
                    "id": "4c8b4e83-e058-4ce5-bcc0-61fdd44722ff",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "id",
            "profiles": [
                {
                    "id": "8fa883d8-41e9-4000-bb12-7aa0ef8c580f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "ja",
            "profiles": [
                {
                    "id": "1162753a-3c7a-4aa9-9d2a-a55cec7efabf",
                    "private": false,
                    "selectors": {
                        "domain": "Customs",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "aa9ec49f-650a-4e6f-9a30-3d3430702012",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b55936a1-2a39-4664-b5f5-b54e27b62b01",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "vi",
            "profiles": [
                {
                    "id": "a87872f4-a8d5-406a-b6d0-8b3954a8e653",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ko",
            "target": "zh",
            "profiles": [
                {
                    "id": "5cbfca7e-ec64-4ee7-8571-f66c501c2b75",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "98e5aba2-e095-4f76-aa84-2b532c97f247",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lt",
            "target": "de",
            "profiles": [
                {
                    "id": "e1db2ebd-5d5d-45c5-88ec-f477bade5522",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lt",
            "target": "en",
            "profiles": [
                {
                    "id": "50e8bb1d-e1e7-4e26-8f00-89cbd4964e1b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lt",
            "target": "es",
            "profiles": [
                {
                    "id": "49afc351-0b30-45a4-aa08-ed59e0fd73d2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lt",
            "target": "fr",
            "profiles": [
                {
                    "id": "c47fcedd-4c65-401e-9232-9c249c5fa332",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lv",
            "target": "de",
            "profiles": [
                {
                    "id": "c5ff923b-6cdc-4ad4-b49c-12118622d1ed",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lv",
            "target": "en",
            "profiles": [
                {
                    "id": "4ee70535-0602-4187-869d-80557031bd32",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "81b9b6b2-411d-4467-aa98-2a3363a1de04",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lv",
            "target": "es",
            "profiles": [
                {
                    "id": "3e739f5c-d5d8-418a-b813-07a7c4326a6d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "5fbb8acf-2c42-4660-adff-d392f30efe84",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "lv",
            "target": "fr",
            "profiles": [
                {
                    "id": "2535ef85-0f9b-4ec7-bf7f-733eeac5e675",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ms",
            "target": "en",
            "profiles": [
                {
                    "id": "d5613f13-782c-4fb9-9380-4cbbe6a7b5e8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "my",
            "target": "de",
            "profiles": [
                {
                    "id": "6320ad4a-434a-4038-8fc0-43e1fda89305",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "my",
            "target": "en",
            "profiles": [
                {
                    "id": "390a8b20-49d1-4d4e-a850-855aa7970855",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "my",
            "target": "es",
            "profiles": [
                {
                    "id": "658a052b-e62f-458c-9d06-37e9ef201d37",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "my",
            "target": "fr",
            "profiles": [
                {
                    "id": "39b5a331-4e8a-4dc5-9b90-f11609b9d606",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "nl",
            "target": "de",
            "profiles": [
                {
                    "id": "b7721827-74b3-4505-9927-4ff008a69c72",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "nl",
            "target": "en",
            "profiles": [
                {
                    "id": "75a5aacc-11a6-4d9c-9b8b-88a393d0931a",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d30fb46d-f957-43cd-94fe-5658b27369c9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "nl",
            "target": "es",
            "profiles": [
                {
                    "id": "11c2fcb1-9be3-4f9e-b9e6-0f61359ad367",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c82d6e41-76cd-49ae-945f-af8ca0c6640c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "nl",
            "target": "fr",
            "profiles": [
                {
                    "id": "5944e1d6-0fb7-4f1e-8776-7c4d3d781efc",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "no",
            "target": "de",
            "profiles": [
                {
                    "id": "5d1a715a-2f58-4ff0-b255-0c050d1f74f0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "no",
            "target": "en",
            "profiles": [
                {
                    "id": "01ddb441-9a7d-4b0e-834a-d596c5a4a93b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "no",
            "target": "es",
            "profiles": [
                {
                    "id": "e84be7d2-a2f9-45f9-904f-3c22cdfd5726",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "no",
            "target": "fr",
            "profiles": [
                {
                    "id": "1f7a4731-8c06-46ce-9d19-31b60e364498",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pa",
            "target": "en",
            "profiles": [
                {
                    "id": "d978c374-1c91-46b9-bb0c-c1d01ae78c4f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pl",
            "target": "de",
            "profiles": [
                {
                    "id": "74db5597-7e84-4ca7-9672-c10431432451",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pl",
            "target": "en",
            "profiles": [
                {
                    "id": "1d852206-6c1a-456e-9a92-b3e6df6a9a3c",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "2f0a9f85-b4a0-45fc-a47d-e293dd7604b5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pl",
            "target": "es",
            "profiles": [
                {
                    "id": "5b7c6334-f9f5-4737-b84c-da92f5a225b5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d6fc3dd1-ebe0-44f8-80b4-2fe0f2ab36ac",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pl",
            "target": "fr",
            "profiles": [
                {
                    "id": "eb757e55-39d3-43e2-8ff1-3c49117a1671",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ps",
            "target": "de",
            "profiles": [
                {
                    "id": "23f4623d-16fe-473d-badb-72d4efe9c8f0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ps",
            "target": "en",
            "profiles": [
                {
                    "id": "2d787243-a03d-44c3-819b-d3a8eb32e700",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ps",
            "target": "es",
            "profiles": [
                {
                    "id": "b4384aad-006e-405b-bd25-9ec748f35f32",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ps",
            "target": "fr",
            "profiles": [
                {
                    "id": "686f59b2-e115-47a8-a96e-b938958c5a0f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pt",
            "target": "de",
            "profiles": [
                {
                    "id": "f2226fb7-dcd6-4173-9988-d3a937b00efe",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pt",
            "target": "en",
            "profiles": [
                {
                    "id": "01a65ce6-aa33-4eb4-aa51-a209bbf829e3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c8d03f29-7b88-456c-9a4c-2302568a728b",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "e17c16c1-9508-4f75-9bd6-a778ec71f753",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pt",
            "target": "es",
            "profiles": [
                {
                    "id": "0ec93b0b-35b5-44a4-8ef3-848cfe81bcad",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "4e18fb94-bb96-4d21-85eb-9e1cfb5cf9af",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "pt",
            "target": "fr",
            "profiles": [
                {
                    "id": "69c5ca21-4ffd-463e-8d64-1e72d962d123",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ro",
            "target": "de",
            "profiles": [
                {
                    "id": "bf71b54a-f2b9-4948-92a1-f0be4f7a4b94",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ro",
            "target": "en",
            "profiles": [
                {
                    "id": "ae4ec6c0-4035-4bbf-a047-63c983eb0881",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ro",
            "target": "es",
            "profiles": [
                {
                    "id": "3188ae8e-c27b-424a-9dbc-4052d7d41ac7",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ro",
            "target": "fr",
            "profiles": [
                {
                    "id": "d4d31544-2f16-482b-992f-5d23bbce3c63",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ru",
            "target": "cs",
            "profiles": [
                {
                    "id": "c666b22b-120f-4034-9650-54b4fb27def2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ru",
            "target": "de",
            "profiles": [
                {
                    "id": "82e58cc5-75a0-4a81-9731-9523983b25ec",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ru",
            "target": "en",
            "profiles": [
                {
                    "id": "14459e34-140f-4380-9d09-ab817011adb7",
                    "private": false,
                    "selectors": {
                        "domain": "Energy",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "213bc44f-51d9-4aff-86f0-675b7122f596",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "5dc13262-289c-412a-9d76-ef1fd60df7e1",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "70422fa0-ad74-482f-95f7-573d2f67bb40",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ru",
            "target": "es",
            "profiles": [
                {
                    "id": "31955fd3-7439-48ed-8818-bea0f186b1e6",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "511842c0-b7cd-468d-b8b3-05bf8668d662",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ru",
            "target": "fr",
            "profiles": [
                {
                    "id": "a6a8ec0c-d437-4d3f-891c-69f16907604d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sk",
            "target": "de",
            "profiles": [
                {
                    "id": "2dbabdb0-7f00-41e6-b4a0-47c076e41570",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sk",
            "target": "en",
            "profiles": [
                {
                    "id": "1e844103-caf4-4189-aeea-5ce993cf50c2",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sk",
            "target": "es",
            "profiles": [
                {
                    "id": "07b3fcff-832c-4b84-b1d5-aa2bb72cff13",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "0e2fba01-ae0b-4ddd-b74c-4d1adff88d15",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sk",
            "target": "fr",
            "profiles": [
                {
                    "id": "267ed482-61dc-4d14-9bb8-e9c1291f7526",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sl",
            "target": "de",
            "profiles": [
                {
                    "id": "2fb9babf-a60e-4c49-94fc-4e367bf458d0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sl",
            "target": "en",
            "profiles": [
                {
                    "id": "e4486be7-cf0e-44e5-bc3e-150383d626a5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sl",
            "target": "es",
            "profiles": [
                {
                    "id": "67663df2-368a-4a98-8fbe-ccef0a086332",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sl",
            "target": "fr",
            "profiles": [
                {
                    "id": "cd2fdcd4-6155-4f2d-96a9-0962f3957a2b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sr",
            "target": "de",
            "profiles": [
                {
                    "id": "02353c0a-7cc8-4b5f-a295-939bb0778a68",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sr",
            "target": "en",
            "profiles": [
                {
                    "id": "3c262acd-daca-4053-b994-2b731b1c678b",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d7819bb2-70b6-4916-84c3-cc34a4bf7d83",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sr",
            "target": "es",
            "profiles": [
                {
                    "id": "069dae8c-8bd3-479f-a599-aca5285eefaa",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sr",
            "target": "fr",
            "profiles": [
                {
                    "id": "4247ec2b-b5d4-4da0-99ed-f2514fe3f471",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sv",
            "target": "de",
            "profiles": [
                {
                    "id": "75eb5f26-b3c0-41c7-a8e9-032ec0c2c036",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sv",
            "target": "en",
            "profiles": [
                {
                    "id": "10bfefa2-d329-4bb6-aa8e-98490977f937",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "af7ac39e-9851-463d-8f56-e6c99f23b2b9",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sv",
            "target": "es",
            "profiles": [
                {
                    "id": "1a5d6d06-01d8-4ea9-acbb-99d6582c89a8",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "609c343c-dd22-412e-bde2-da8bcf1af96e",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sv",
            "target": "fr",
            "profiles": [
                {
                    "id": "f053bd03-5c8d-45a1-9b5f-99601adb3a10",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sw",
            "target": "de",
            "profiles": [
                {
                    "id": "48208468-0202-4333-b716-41cb6d965af7",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sw",
            "target": "en",
            "profiles": [
                {
                    "id": "09f97216-15ab-458b-8f96-44aeacaa12f4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sw",
            "target": "es",
            "profiles": [
                {
                    "id": "628ed6c4-b2cb-4cae-ac9c-1276e6db36e9",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "c7a88ac2-a222-49f9-84f2-ea83f8c4191d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "sw",
            "target": "fr",
            "profiles": [
                {
                    "id": "19dc8084-b71b-4104-96f2-42462121520f",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ta",
            "target": "de",
            "profiles": [
                {
                    "id": "16197972-1966-4085-b73c-21d30fac7249",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ta",
            "target": "en",
            "profiles": [
                {
                    "id": "4920db29-acb1-4333-8608-a1fcb79ee27a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ta",
            "target": "es",
            "profiles": [
                {
                    "id": "5681712a-2f62-41d3-916c-11164d2d91b5",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ta",
            "target": "fr",
            "profiles": [
                {
                    "id": "7ed1cd13-e95a-495b-98aa-84f970a0f587",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tg",
            "target": "de",
            "profiles": [
                {
                    "id": "34854b26-7493-469d-a00f-0ca3c59f98f0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tg",
            "target": "en",
            "profiles": [
                {
                    "id": "dbbb0384-a668-4105-ba2e-8ae4df6e3b1c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tg",
            "target": "es",
            "profiles": [
                {
                    "id": "09cd14e0-047a-4c7f-be9a-ad94e0942b9c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tg",
            "target": "fr",
            "profiles": [
                {
                    "id": "9a90b932-1d7b-49ad-8f88-ba2df5b2bfeb",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "th",
            "target": "de",
            "profiles": [
                {
                    "id": "e9a10b08-a6c1-4f8f-93e5-a2a50cdb3f07",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "th",
            "target": "en",
            "profiles": [
                {
                    "id": "fb24afae-f5c2-42a2-8cba-a1deec9e8941",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "th",
            "target": "es",
            "profiles": [
                {
                    "id": "89d221d0-d509-44f4-ab6e-9de013c6ec91",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "th",
            "target": "fr",
            "profiles": [
                {
                    "id": "738c5127-dfb7-4e3f-80a5-b1de6ffec3f7",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tl",
            "target": "en",
            "profiles": [
                {
                    "id": "76c55afc-4bea-4b27-8714-fd3803a60856",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tr",
            "target": "de",
            "profiles": [
                {
                    "id": "8e9bab87-7796-4f97-8900-0b106289b2f3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tr",
            "target": "en",
            "profiles": [
                {
                    "id": "e4d2a0aa-949b-46d9-b37a-8af99a0279ff",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tr",
            "target": "es",
            "profiles": [
                {
                    "id": "baa01939-01cd-4b2c-882e-4f5ee942f34a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "tr",
            "target": "fr",
            "profiles": [
                {
                    "id": "e823f5b2-8d62-444b-8219-6598c57742f0",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "uk",
            "target": "cs",
            "profiles": [
                {
                    "id": "5fc44e36-7d37-4a81-bf97-37a41ecaa464",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "uk",
            "target": "de",
            "profiles": [
                {
                    "id": "18a3d057-601b-421c-bec4-4a96e030c94a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "uk",
            "target": "en",
            "profiles": [
                {
                    "id": "fbd0b1be-27b7-40c7-a29c-6dc1b230127c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "uk",
            "target": "es",
            "profiles": [
                {
                    "id": "a43ead80-7d21-4da4-a07d-0177e6f81733",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "uk",
            "target": "fr",
            "profiles": [
                {
                    "id": "ee53f33e-d2ff-4864-8f8f-64b332f35540",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ur",
            "target": "de",
            "profiles": [
                {
                    "id": "3038b1fb-277a-4cdb-bfaf-48fe9ffb97a4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ur",
            "target": "en",
            "profiles": [
                {
                    "id": "3c49ef50-7d7e-492a-8aa6-5d0304642891",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ur",
            "target": "es",
            "profiles": [
                {
                    "id": "8400df0b-2881-4294-bd0d-be6a68b9232d",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "ur",
            "target": "fr",
            "profiles": [
                {
                    "id": "b317f168-eba1-4cec-8b1e-d7961459d5aa",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "vi",
            "target": "de",
            "profiles": [
                {
                    "id": "42eecb5d-97ba-4705-a41b-6e38bc7880ae",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "vi",
            "target": "en",
            "profiles": [
                {
                    "id": "de18ec43-8ef4-493f-8d2d-f52fa6033dae",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "vi",
            "target": "es",
            "profiles": [
                {
                    "id": "225b768f-ad75-40fe-8fb9-93dd79c92058",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "vi",
            "target": "fr",
            "profiles": [
                {
                    "id": "510dd153-a358-43f8-8c6e-457ae110e32a",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "vi",
            "target": "ko",
            "profiles": [
                {
                    "id": "a432318b-1611-4a23-bdbb-88ef316c3b17",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zh",
            "target": "de",
            "profiles": [
                {
                    "id": "0dda1997-d500-4bec-aff9-4137b9d10672",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zh",
            "target": "en",
            "profiles": [
                {
                    "id": "2f627e51-a42a-4cb5-9683-a3f589b9a2d8",
                    "private": false,
                    "selectors": {
                        "domain": "Finance",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "72911fce-80af-4442-afe0-3ed2d71a30e9",
                    "private": false,
                    "selectors": {
                        "domain": "Health",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "80206c6b-8629-4ea1-87f2-dadeecd4ccd1",
                    "private": false,
                    "selectors": {
                        "domain": "Generic_Multi_Scripts",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "bf1e47b9-9ccb-472c-938b-896b2ced3714",
                    "private": false,
                    "selectors": {
                        "domain": "Cybersecurity",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "d6792d84-f3d7-49ce-a83e-dc79604f6f15",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "f0a04a30-5637-48c5-a896-885fde0aec13",
                    "private": false,
                    "selectors": {
                        "domain": "IT",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zh",
            "target": "es",
            "profiles": [
                {
                    "id": "33c763ea-880f-4f52-b66f-4b78b77eaca3",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "b4bb84c2-305d-4d83-81a3-aa778cbe312c",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zh",
            "target": "fr",
            "profiles": [
                {
                    "id": "4607c9d4-1b78-4344-a080-17229d500590",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zh",
            "target": "ko",
            "profiles": [
                {
                    "id": "08fe1f9b-75a5-4abf-a581-e2ed712353a3",
                    "private": false,
                    "selectors": {
                        "domain": "Patent",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                },
                {
                    "id": "4a51ada9-7cc7-443e-942a-91bc2f2455a4",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "L",
                        "tech": {
                            "name": "Docker-OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        },
        {
            "source": "zt",
            "target": "en",
            "profiles": [
                {
                    "id": "2d70bb1a-9a22-42a4-9cc8-5c327fb97903",
                    "private": false,
                    "selectors": {
                        "domain": "Generic",
                        "owner": "Systran",
                        "size": "M",
                        "tech": {
                            "name": "OpenNMT-ctranslate",
                            "type": "NMT"
                        }
                    }
                }
            ]
        }
    ]
}

const Test = async () => {
    const arr = []

    for (let pair of pairs.languagePairs) {
        arr.push({
            source: pair.source,
            target: pair.target
        })
    }

    fs.writeFileSync(outputPath, JSON.stringify(arr, null, 1))

    console.log('done')
}

Test()