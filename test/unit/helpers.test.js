// Testes unitários para funções auxiliares

function formatarData(dataString) {
    if (!dataString) return "-";
    // Solução: criar data no UTC para evitar timezone
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
}

function getStatusClass(status) {
    if (status === "Concluído") return "badge-completed";
    if (status === "Processando") return "badge-processing";
    return "badge-pending";
}

function getStatusText(status) {
    return status || "Pendente";
}

function checkPasswordStrength(password) {
    if (!password || password.length < 6) return "weak";
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
}

describe("Testes Unitários - Helpers", () => {
    
    describe("formatarData()", () => {
        test("deve retornar '-' quando data for vazia", () => {
            expect(formatarData(null)).toBe("-");
            expect(formatarData("")).toBe("-");
            expect(formatarData(undefined)).toBe("-");
        });

        test("deve formatar data corretamente", () => {
            expect(formatarData("2024-01-15")).toBe("15/01/2024");
            expect(formatarData("2024-12-25")).toBe("25/12/2024");
        });
    });

    describe("getStatusClass()", () => {
        test("deve retornar badge-completed para Concluído", () => {
            expect(getStatusClass("Concluído")).toBe("badge-completed");
        });

        test("deve retornar badge-processing para Processando", () => {
            expect(getStatusClass("Processando")).toBe("badge-processing");
        });

        test("deve retornar badge-pending para outros status", () => {
            expect(getStatusClass("Aberto")).toBe("badge-pending");
            expect(getStatusClass("Pendente")).toBe("badge-pending");
            expect(getStatusClass(null)).toBe("badge-pending");
        });
    });

    describe("getStatusText()", () => {
        test("deve retornar o status quando existir", () => {
            expect(getStatusText("Concluído")).toBe("Concluído");
            expect(getStatusText("Aberto")).toBe("Aberto");
        });

        test("deve retornar 'Pendente' quando status for vazio", () => {
            expect(getStatusText(null)).toBe("Pendente");
            expect(getStatusText("")).toBe("Pendente");
        });
    });

    describe("checkPasswordStrength()", () => {
        test("deve retornar 'weak' para senhas fracas", () => {
            expect(checkPasswordStrength("123")).toBe("weak");
            expect(checkPasswordStrength("abc")).toBe("weak");
            expect(checkPasswordStrength("")).toBe("weak");
            expect(checkPasswordStrength("abc123")).toBe("weak");
        });

        test("deve retornar 'medium' para senhas médias", () => {
            expect(checkPasswordStrength("Abc12345")).toBe("medium");
            expect(checkPasswordStrength("Senha123")).toBe("medium");
        });

        test("deve retornar 'strong' para senhas fortes", () => {
            expect(checkPasswordStrength("SenhaForte123!")).toBe("strong");
            expect(checkPasswordStrength("Abc@123456")).toBe("strong");
            expect(checkPasswordStrength("P@ssw0rd123!")).toBe("strong");
        });
    });
});