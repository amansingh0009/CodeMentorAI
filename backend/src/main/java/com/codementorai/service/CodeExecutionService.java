package com.codementorai.service;

import com.codementorai.dto.CodeExecutionRequest;
import com.codementorai.dto.CodeExecutionResponse;
import com.codementorai.dto.TestCaseResultDto;
import com.codementorai.exception.ResourceNotFoundException;
import com.codementorai.model.Question;
import com.codementorai.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {
    private static final Duration TIMEOUT = Duration.ofSeconds(5);

    private final QuestionRepository questionRepository;

    public CodeExecutionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public CodeExecutionResponse run(CodeExecutionRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!"Two Sum".equalsIgnoreCase(question.getTitle())) {
            return CodeExecutionResponse.builder()
                    .status("UNSUPPORTED")
                    .message("The compiler currently supports runnable test cases for Two Sum. Add a harness for this problem to enable execution.")
                    .passedCount(0)
                    .totalCount(0)
                    .results(List.of())
                    .build();
        }

        try {
            ExecutionOutput output = execute(request.getLanguage(), request.getCode());
            if (!output.compileError().isBlank()) {
                return CodeExecutionResponse.builder()
                        .status("COMPILE_ERROR")
                        .message(output.compileError())
                        .passedCount(0)
                        .totalCount(TWO_SUM_CASES.size())
                        .results(failedResults(output.compileError()))
                        .build();
            }

            List<TestCaseResultDto> results = parseResults(output.stdout(), output.stderr());
            long passed = results.stream().filter(TestCaseResultDto::getPassed).count();
            return CodeExecutionResponse.builder()
                    .status(passed == TWO_SUM_CASES.size() ? "ACCEPTED" : "FAILED")
                    .message(passed + " of " + TWO_SUM_CASES.size() + " test cases passed.")
                    .passedCount((int) passed)
                    .totalCount(TWO_SUM_CASES.size())
                    .results(results)
                    .build();
        } catch (IllegalArgumentException ex) {
            return CodeExecutionResponse.builder()
                    .status("UNSUPPORTED")
                    .message(ex.getMessage())
                    .passedCount(0)
                    .totalCount(TWO_SUM_CASES.size())
                    .results(List.of())
                    .build();
        } catch (Exception ex) {
            return CodeExecutionResponse.builder()
                    .status("RUNTIME_ERROR")
                    .message(ex.getMessage())
                    .passedCount(0)
                    .totalCount(TWO_SUM_CASES.size())
                    .results(failedResults(ex.getMessage()))
                    .build();
        }
    }

    private ExecutionOutput execute(String language, String code) throws IOException, InterruptedException {
        String normalized = language == null ? "" : language.trim().toLowerCase();
        Path workDir = Files.createTempDirectory("codementor-run-");
        try {
            return switch (normalized) {
                case "java" -> runJava(workDir, code);
                case "python" -> runScript(workDir, "solution.py", buildPythonSource(code), "python");
                case "javascript" -> runScript(workDir, "solution.js", buildJavaScriptSource(code), "node");
                default -> throw new IllegalArgumentException("Unsupported language: " + language);
            };
        } finally {
            deleteDirectory(workDir);
        }
    }

    private ExecutionOutput runJava(Path workDir, String code) throws IOException, InterruptedException {
        Path source = workDir.resolve("Main.java");
        Files.writeString(source, buildJavaSource(code), StandardCharsets.UTF_8);

        ProcessResult compile = runProcess(workDir, List.of("javac", "Main.java"));
        if (compile.exitCode() != 0) {
            return new ExecutionOutput("", compile.output(), compile.output());
        }

        ProcessResult run = runProcess(workDir, List.of("java", "Main"));
        return new ExecutionOutput(run.output(), run.exitCode() == 0 ? "" : run.output(), "");
    }

    private ExecutionOutput runScript(Path workDir, String fileName, String source, String command) throws IOException, InterruptedException {
        Files.writeString(workDir.resolve(fileName), source, StandardCharsets.UTF_8);
        ProcessResult run = runProcess(workDir, List.of(command, fileName));
        return new ExecutionOutput(run.output(), run.exitCode() == 0 ? "" : run.output(), "");
    }

    private ProcessResult runProcess(Path workDir, List<String> command) throws IOException, InterruptedException {
        Process process = new ProcessBuilder(command)
                .directory(workDir.toFile())
                .redirectErrorStream(true)
                .start();

        boolean finished = process.waitFor(TIMEOUT.toMillis(), TimeUnit.MILLISECONDS);
        if (!finished) {
            process.destroyForcibly();
            return new ProcessResult(124, "Execution timed out after " + TIMEOUT.toSeconds() + " seconds.");
        }

        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();
        return new ProcessResult(process.exitValue(), output);
    }

    private String buildJavaSource(String userCode) {
        return userCode + """

                public class Main {
                    private static final int[][] NUMS = {
                        {2, 7, 11, 15},
                        {3, 2, 4},
                        {3, 3},
                        {-1, -2, -3, -4, -5},
                        {0, 4, 3, 0},
                        {1000000000, -1000000000, 5, 7}
                    };
                    private static final int[] TARGETS = {9, 6, 6, -8, 0, 12};
                    private static final int[][] EXPECTED = {
                        {0, 1},
                        {1, 2},
                        {0, 1},
                        {2, 4},
                        {0, 3},
                        {2, 3}
                    };

                    public static void main(String[] args) {
                        Solution solution = new Solution();
                        for (int i = 0; i < NUMS.length; i++) {
                            try {
                                int[] actual = solution.twoSum(NUMS[i], TARGETS[i]);
                                System.out.println(format(i + 1, actual, matches(actual, EXPECTED[i]), ""));
                            } catch (Exception ex) {
                                System.out.println(format(i + 1, new int[0], false, ex.getClass().getSimpleName() + ": " + ex.getMessage()));
                            }
                        }
                    }

                    private static boolean matches(int[] actual, int[] expected) {
                        if (actual == null || actual.length != 2) return false;
                        int a = Math.min(actual[0], actual[1]);
                        int b = Math.max(actual[0], actual[1]);
                        int e1 = Math.min(expected[0], expected[1]);
                        int e2 = Math.max(expected[0], expected[1]);
                        return a == e1 && b == e2;
                    }

                    private static String array(int[] values) {
                        if (values == null) return "null";
                        if (values.length == 0) return "[]";
                        return "[" + values[0] + "," + values[1] + "]";
                    }

                    private static String format(int caseNumber, int[] actual, boolean passed, String error) {
                        return caseNumber + "|" + array(actual) + "|" + passed + "|" + error;
                    }
                }
                """;
    }

    private String buildPythonSource(String userCode) {
        return userCode + """

                TESTS = [
                    ([2, 7, 11, 15], 9, [0, 1]),
                    ([3, 2, 4], 6, [1, 2]),
                    ([3, 3], 6, [0, 1]),
                    ([-1, -2, -3, -4, -5], -8, [2, 4]),
                    ([0, 4, 3, 0], 0, [0, 3]),
                    ([1000000000, -1000000000, 5, 7], 12, [2, 3]),
                ]

                def fmt(values):
                    if values is None:
                        return "null"
                    return "[" + ",".join(str(v) for v in values) + "]"

                solver = Solution()
                for index, (nums, target, expected) in enumerate(TESTS, start=1):
                    try:
                        actual = solver.twoSum(nums, target)
                        passed = sorted(actual or []) == sorted(expected)
                        print(f"{index}|{fmt(actual)}|{str(passed).lower()}|")
                    except Exception as ex:
                        print(f"{index}|[]|false|{type(ex).__name__}: {ex}")
                """;
    }

    private String buildJavaScriptSource(String userCode) {
        return userCode + """

                const tests = [
                  [[2, 7, 11, 15], 9, [0, 1]],
                  [[3, 2, 4], 6, [1, 2]],
                  [[3, 3], 6, [0, 1]],
                  [[-1, -2, -3, -4, -5], -8, [2, 4]],
                  [[0, 4, 3, 0], 0, [0, 3]],
                  [[1000000000, -1000000000, 5, 7], 12, [2, 3]],
                ];

                const fmt = (values) => Array.isArray(values) ? `[${values.join(",")}]` : "null";
                tests.forEach(([nums, target, expected], index) => {
                  try {
                    const actual = twoSum(nums, target);
                    const passed = Array.isArray(actual)
                      && actual.length === 2
                      && [...actual].sort((a, b) => a - b).join(",") === [...expected].sort((a, b) => a - b).join(",");
                    console.log(`${index + 1}|${fmt(actual)}|${passed}|`);
                  } catch (error) {
                    console.log(`${index + 1}|[]|false|${error.name}: ${error.message}`);
                  }
                });
                """;
    }

    private List<TestCaseResultDto> parseResults(String stdout, String stderr) {
        List<TestCaseResultDto> results = new ArrayList<>();
        String[] lines = stdout == null || stdout.isBlank() ? new String[0] : stdout.split("\\R");
        for (String line : lines) {
            String[] parts = line.split("\\|", 4);
            if (parts.length < 3) {
                continue;
            }
            int index = Integer.parseInt(parts[0]);
            TwoSumCase testCase = TWO_SUM_CASES.get(index - 1);
            results.add(TestCaseResultDto.builder()
                    .caseNumber(index)
                    .input(testCase.input())
                    .expectedOutput(testCase.expected())
                    .actualOutput(parts[1])
                    .passed(Boolean.parseBoolean(parts[2]))
                    .error(parts.length == 4 ? parts[3] : "")
                    .build());
        }

        while (results.size() < TWO_SUM_CASES.size()) {
            TwoSumCase testCase = TWO_SUM_CASES.get(results.size());
            results.add(TestCaseResultDto.builder()
                    .caseNumber(results.size() + 1)
                    .input(testCase.input())
                    .expectedOutput(testCase.expected())
                    .actualOutput("")
                    .passed(false)
                    .error(stderr == null || stderr.isBlank() ? "No result returned." : stderr)
                    .build());
        }
        return results;
    }

    private List<TestCaseResultDto> failedResults(String error) {
        List<TestCaseResultDto> results = new ArrayList<>();
        for (int i = 0; i < TWO_SUM_CASES.size(); i++) {
            TwoSumCase testCase = TWO_SUM_CASES.get(i);
            results.add(TestCaseResultDto.builder()
                    .caseNumber(i + 1)
                    .input(testCase.input())
                    .expectedOutput(testCase.expected())
                    .actualOutput("")
                    .passed(false)
                    .error(error)
                    .build());
        }
        return results;
    }

    private void deleteDirectory(Path directory) throws IOException {
        if (directory == null || !Files.exists(directory)) {
            return;
        }
        try (var paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });
        }
    }

    private static final List<TwoSumCase> TWO_SUM_CASES = List.of(
            new TwoSumCase("nums = [2,7,11,15], target = 9", "[0,1]"),
            new TwoSumCase("nums = [3,2,4], target = 6", "[1,2]"),
            new TwoSumCase("nums = [3,3], target = 6", "[0,1]"),
            new TwoSumCase("nums = [-1,-2,-3,-4,-5], target = -8", "[2,4]"),
            new TwoSumCase("nums = [0,4,3,0], target = 0", "[0,3]"),
            new TwoSumCase("nums = [1000000000,-1000000000,5,7], target = 12", "[2,3]")
    );

    private record TwoSumCase(String input, String expected) {
    }

    private record ProcessResult(int exitCode, String output) {
    }

    private record ExecutionOutput(String stdout, String stderr, String compileError) {
    }
}
