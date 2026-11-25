module.exports = [
  {
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "topics": [
      "Arrays",
      "Hash Map"
    ],
    "statement": "Given an array of integers and a target value, return the indices of the two numbers such that they add up to the target. Assume exactly one solution exists, and you may not use the same element twice. Return the indices in ascending order.",
    "inputFormat": "Line 1: n (size of array)\nLine 2: n space-separated integers\nLine 3: target",
    "outputFormat": "Two 0-indexed indices, space-separated, in ascending order.",
    "constraints": "2 <= n <= 1000",
    "examples": [
      {
        "input": "4\n2 7 11 15\n9",
        "output": "0 1",
        "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
      },
      {
        "input": "3\n3 2 4\n6",
        "output": "1 2",
        "explanation": "nums[1] + nums[2] = 2 + 4 = 6"
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: return the two indices (space separated) that add up to target\ndef solve(arr, target):\n    pass\n\nresult = solve(arr, target)\nprint(*result)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: return the two indices (space separated) that add up to target\nfunction solve(arr, target) {\n\n}\n\nconsole.log(solve(arr, target).join(' '));\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the two indices (space separated) that add up to target\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n\n    // TODO: print the two indices (space separated) that add up to target\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[1000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    int target;\n    scanf(\"%d\", &target);\n\n    // TODO: print the two indices (space separated) that add up to target\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n2 7 11 15\n9",
        "expectedOutput": "0 1",
        "isHidden": false
      },
      {
        "input": "3\n3 2 4\n6",
        "expectedOutput": "1 2",
        "isHidden": false
      },
      {
        "input": "2\n3 3\n6",
        "expectedOutput": "0 1",
        "isHidden": true
      },
      {
        "input": "4\n-3 4 3 90\n0",
        "expectedOutput": "0 2",
        "isHidden": true
      },
      {
        "input": "5\n1 2 3 4 5\n9",
        "expectedOutput": "3 4",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "Easy",
    "topics": [
      "Strings",
      "Two Pointers"
    ],
    "statement": "Given a string of lowercase letters, determine whether it reads the same forwards and backwards. Print \"true\" if it is a palindrome, otherwise print \"false\".",
    "inputFormat": "Line 1: a string of lowercase letters",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= length <= 1000",
    "examples": [
      {
        "input": "racecar",
        "output": "true",
        "explanation": "Reads the same forwards and backwards."
      },
      {
        "input": "hello",
        "output": "false",
        "explanation": "Not a palindrome."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print \"true\" if s is a palindrome, else \"false\"\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print \"true\" if s is a palindrome, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print \"true\" if s is a palindrome, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print \"true\" if s is a palindrome, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001];\n    scanf(\"%s\", s);\n\n    // TODO: print \"true\" if s is a palindrome, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "racecar",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "hello",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "a",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "abba",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "abcd",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "title": "FizzBuzz",
    "slug": "fizzbuzz",
    "difficulty": "Easy",
    "topics": [
      "Math"
    ],
    "statement": "Print the numbers from 1 to n space-separated. For multiples of 3 print \"Fizz\" instead of the number, for multiples of 5 print \"Buzz\", and for multiples of both print \"FizzBuzz\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "n space-separated tokens on a single line",
    "constraints": "1 <= n <= 1000",
    "examples": [
      {
        "input": "5",
        "output": "1 2 Fizz 4 Buzz",
        "explanation": "3 is a multiple of 3, 5 is a multiple of 5."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print numbers 1..n space separated, replacing multiples of 3 with \"Fizz\",\n# multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\"\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print numbers 1..n space separated, replacing multiples of 3 with \"Fizz\",\n// multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print numbers 1..n space separated, replacing multiples of 3 with \"Fizz\",\n        // multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n\n    // TODO: print numbers 1..n space separated, replacing multiples of 3 with \"Fizz\",\n    // multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n\n    // TODO: print numbers 1..n space separated, replacing multiples of 3 with \"Fizz\",\n    // multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "1 2 Fizz 4 Buzz",
        "isHidden": false
      },
      {
        "input": "15",
        "expectedOutput": "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz",
        "isHidden": false
      },
      {
        "input": "3",
        "expectedOutput": "1 2 Fizz",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "20",
        "expectedOutput": "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Maximum Subarray Sum",
    "slug": "maximum-subarray-sum",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Dynamic Programming"
    ],
    "statement": "Given an array of integers (which may include negative numbers), find the contiguous subarray with the largest sum and print that sum.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the maximum subarray sum",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "9\n-2 1 -3 4 -1 2 1 -5 4",
        "output": "6",
        "explanation": "Subarray [4,-1,2,1] has the largest sum, 6."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the maximum contiguous subarray sum (Kadane's algorithm)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the maximum contiguous subarray sum (Kadane's algorithm)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the maximum contiguous subarray sum (Kadane's algorithm)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the maximum contiguous subarray sum (Kadane's algorithm)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the maximum contiguous subarray sum (Kadane's algorithm)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "9\n-2 1 -3 4 -1 2 1 -5 4",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "5\n-1 -2 -3 -4 -5",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "1\n-5",
        "expectedOutput": "-5",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Binary Search",
    "slug": "binary-search",
    "difficulty": "Medium",
    "topics": [
      "Searching",
      "Arrays"
    ],
    "statement": "Given a sorted array of integers and a target value, return the 0-indexed position of the target using binary search. If the target is not found, print -1.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated sorted integers\nLine 3: target",
    "outputFormat": "A single integer: the index of target, or -1 if not found",
    "constraints": "1 <= n <= 100000, array is sorted ascending",
    "examples": [
      {
        "input": "6\n-10 -3 0 5 9 12\n9",
        "output": "4",
        "explanation": "arr[4] == 9"
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: print the index of target using binary search, or -1 if not found\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: print the index of target using binary search, or -1 if not found\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the index of target using binary search, or -1 if not found\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n\n    // TODO: print the index of target using binary search, or -1 if not found\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    int target;\n    scanf(\"%d\", &target);\n\n    // TODO: print the index of target using binary search, or -1 if not found\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\n-10 -3 0 5 9 12\n9",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "5\n1 2 3 4 5\n6",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "5\n2 4 6 8 10\n2",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "5\n2 4 6 8 10\n10",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Nth Fibonacci (mod 1e9+7)",
    "slug": "nth-fibonacci-mod",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming",
      "Math"
    ],
    "statement": "Given n, compute the nth Fibonacci number (F(0) = 0, F(1) = 1) modulo 1,000,000,007. n can be large, so an efficient iterative approach is required instead of naive recursion.",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: F(n) mod 1000000007",
    "constraints": "0 <= n <= 1000000",
    "examples": [
      {
        "input": "10",
        "output": "55",
        "explanation": "F(10) = 55"
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nMOD = 1_000_000_007\n\n# TODO: print F(n) % MOD using an iterative approach\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\nconst MOD = 1000000007n;\n\n// TODO: print F(n) % MOD using an iterative approach (BigInt recommended)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        final long MOD = 1000000007L;\n\n        // TODO: print F(n) % MOD using an iterative approach\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n    const long long MOD = 1000000007;\n\n    // TODO: print F(n) % MOD using an iterative approach\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n    const long long MOD = 1000000007;\n\n    // TODO: print F(n) % MOD using an iterative approach\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "10",
        "expectedOutput": "55",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "50",
        "expectedOutput": "586268941",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "1000000",
        "expectedOutput": "918091266",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Reverse an Array",
    "slug": "reverse-array",
    "difficulty": "Easy",
    "topics": [
      "Arrays"
    ],
    "statement": "Given an array of integers, print its elements in reverse order, space-separated.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "n space-separated integers, in reverse order",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "5 4 3 2 1",
        "explanation": "Elements printed back to front."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the array elements in reverse order, space separated\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the array elements in reverse order, space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the array elements in reverse order, space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the array elements in reverse order, space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the array elements in reverse order, space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1",
        "isHidden": false
      },
      {
        "input": "3\n7 7 7",
        "expectedOutput": "7 7 7",
        "isHidden": false
      },
      {
        "input": "1\n9",
        "expectedOutput": "9",
        "isHidden": true
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "2 1",
        "isHidden": true
      },
      {
        "input": "4\n-1 -2 -3 -4",
        "expectedOutput": "-4 -3 -2 -1",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Count Vowels in a String",
    "slug": "count-vowels",
    "difficulty": "Easy",
    "topics": [
      "Strings"
    ],
    "statement": "Given a string of lowercase letters, print the number of vowels (a, e, i, o, u) it contains.",
    "inputFormat": "Line 1: a string of lowercase letters",
    "outputFormat": "A single integer: the vowel count",
    "constraints": "1 <= length <= 1000",
    "examples": [
      {
        "input": "hello",
        "output": "2",
        "explanation": "\"e\" and \"o\" are vowels."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the number of vowels (a, e, i, o, u) in s\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the number of vowels (a, e, i, o, u) in s\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the number of vowels (a, e, i, o, u) in s\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the number of vowels (a, e, i, o, u) in s\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001];\n    scanf(\"%s\", s);\n\n    // TODO: print the number of vowels (a, e, i, o, u) in s\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "hello",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "sky",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "education",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "aeiouaeiou",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "e",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Find Maximum and Minimum in an Array",
    "slug": "max-min-array",
    "difficulty": "Easy",
    "topics": [
      "Arrays"
    ],
    "statement": "Given an array of integers, print the maximum and minimum values, space-separated (maximum first).",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "\"max min\"",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "5\n3 1 4 1 5",
        "output": "5 1",
        "explanation": "Max is 5, min is 1."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print \"max min\"\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print \"max min\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print \"max min\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print \"max min\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print \"max min\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n3 1 4 1 5",
        "expectedOutput": "5 1",
        "isHidden": false
      },
      {
        "input": "3\n-2 -5 -1",
        "expectedOutput": "-1 -5",
        "isHidden": false
      },
      {
        "input": "1\n7",
        "expectedOutput": "7 7",
        "isHidden": true
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "2 1",
        "isHidden": true
      },
      {
        "input": "4\n5 5 5 5",
        "expectedOutput": "5 5",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Check Prime Number",
    "slug": "check-prime",
    "difficulty": "Easy",
    "topics": [
      "Math"
    ],
    "statement": "Given an integer n, print \"true\" if it is a prime number, otherwise print \"false\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= n <= 1000000",
    "examples": [
      {
        "input": "7",
        "output": "true",
        "explanation": "7 has no divisors other than 1 and itself."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print \"true\" if n is prime, else \"false\"\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print \"true\" if n is prime, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print \"true\" if n is prime, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n\n    // TODO: print \"true\" if n is prime, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n\n    // TODO: print \"true\" if n is prime, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "7",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "8",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "2",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "104729",
        "expectedOutput": "true",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Sum of Digits",
    "slug": "sum-of-digits",
    "difficulty": "Easy",
    "topics": [
      "Math"
    ],
    "statement": "Given a non-negative integer n, print the sum of its digits.",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: the digit sum",
    "constraints": "0 <= n <= 10^18",
    "examples": [
      {
        "input": "12345",
        "output": "15",
        "explanation": "1+2+3+4+5 = 15."
      }
    ],
    "starterCode": {
      "python": "n = input().strip()\n\n# TODO: print the sum of the digits of n\n",
      "javascript": "const n = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the sum of the digits of n\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.nextLine().trim();\n\n        // TODO: print the sum of the digits of n\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string n;\n    cin >> n;\n\n    // TODO: print the sum of the digits of n\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    char n[20];\n    scanf(\"%s\", n);\n\n    // TODO: print the sum of the digits of n\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "12345",
        "expectedOutput": "15",
        "isHidden": false
      },
      {
        "input": "9",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "1000",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "999999999999999999",
        "expectedOutput": "162",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Factorial of a Number",
    "slug": "factorial",
    "difficulty": "Easy",
    "topics": [
      "Math",
      "Recursion"
    ],
    "statement": "Given a non-negative integer n, print n! (n factorial).",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: n!",
    "constraints": "0 <= n <= 20",
    "examples": [
      {
        "input": "5",
        "output": "120",
        "explanation": "5! = 5x4x3x2x1 = 120."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print n! (n factorial)\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print n! (n factorial). Use BigInt if needed.\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print n! (n factorial). Use long for the result.\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print n! (n factorial). Use long long for the result.\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print n! (n factorial). Use long long for the result.\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "120",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "10",
        "expectedOutput": "3628800",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "20",
        "expectedOutput": "2432902008176640000",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Check Armstrong Number",
    "slug": "check-armstrong-number",
    "difficulty": "Easy",
    "topics": [
      "Math"
    ],
    "statement": "An Armstrong number is a number that equals the sum of its own digits each raised to the power of the number of digits (e.g. 153 = 1^3 + 5^3 + 3^3). Given n, print \"true\" if it is an Armstrong number, else \"false\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= n <= 1000000000",
    "examples": [
      {
        "input": "153",
        "output": "true",
        "explanation": "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print \"true\" if n is an Armstrong number, else \"false\"\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print \"true\" if n is an Armstrong number, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print \"true\" if n is an Armstrong number, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print \"true\" if n is an Armstrong number, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print \"true\" if n is an Armstrong number, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "153",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "123",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "9474",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "100",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Reverse a Number",
    "slug": "reverse-number",
    "difficulty": "Easy",
    "topics": [
      "Math"
    ],
    "statement": "Given a non-negative integer n, print its digits reversed (leading zeros in the result are dropped naturally).",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: n with its digits reversed",
    "constraints": "0 <= n <= 10^9",
    "examples": [
      {
        "input": "12345",
        "output": "54321",
        "explanation": "Digits reversed."
      }
    ],
    "starterCode": {
      "python": "n = input().strip()\n\n# TODO: print n with its digits reversed, as an integer\n",
      "javascript": "const n = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print n with its digits reversed, as an integer\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.nextLine().trim();\n\n        // TODO: print n with its digits reversed, as an integer\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string n;\n    cin >> n;\n\n    // TODO: print n with its digits reversed, as an integer\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    char n[12];\n    scanf(\"%s\", n);\n\n    // TODO: print n with its digits reversed, as an integer\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "12345",
        "expectedOutput": "54321",
        "isHidden": false
      },
      {
        "input": "120",
        "expectedOutput": "21",
        "isHidden": false
      },
      {
        "input": "7",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1000000000",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Count Occurrences of a Character in a String",
    "slug": "count-char-occurrences",
    "difficulty": "Easy",
    "topics": [
      "Strings"
    ],
    "statement": "Given a string s and a single character c, print how many times c occurs in s.",
    "inputFormat": "Line 1: s\nLine 2: c (a single character)",
    "outputFormat": "A single integer: the count of c in s",
    "constraints": "1 <= length of s <= 1000",
    "examples": [
      {
        "input": "hello world\no",
        "output": "2",
        "explanation": "\"o\" appears twice."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\nc = input().strip()\n\n# TODO: print how many times c occurs in s\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst s = lines[0].trim();\nconst c = lines[1].trim();\n\n// TODO: print how many times c occurs in s\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        String c = sc.nextLine().trim();\n\n        // TODO: print how many times c occurs in s\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s, c;\n    getline(cin, s);\n    getline(cin, c);\n\n    // TODO: print how many times c occurs in s\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001], c[2];\n    scanf(\"%[^\\n]%*c\", s);\n    scanf(\"%s\", c);\n\n    // TODO: print how many times c occurs in s\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "hello world\no",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "aaaa\na",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "test\nz",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "Hello\nh",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "bbbbb\nb",
        "expectedOutput": "5",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Check Anagram",
    "slug": "check-anagram",
    "difficulty": "Easy",
    "topics": [
      "Strings",
      "Sorting"
    ],
    "statement": "Given two strings of lowercase letters, print \"true\" if they are anagrams of each other, otherwise print \"false\".",
    "inputFormat": "Line 1: s1\nLine 2: s2",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= length <= 1000",
    "examples": [
      {
        "input": "listen\nsilent",
        "output": "true",
        "explanation": "Both contain the same letters."
      }
    ],
    "starterCode": {
      "python": "s1 = input().strip()\ns2 = input().strip()\n\n# TODO: print \"true\" if s1 and s2 are anagrams, else \"false\"\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst s1 = lines[0].trim();\nconst s2 = lines[1].trim();\n\n// TODO: print \"true\" if s1 and s2 are anagrams, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.nextLine().trim();\n        String s2 = sc.nextLine().trim();\n\n        // TODO: print \"true\" if s1 and s2 are anagrams, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n\n    // TODO: print \"true\" if s1 and s2 are anagrams, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s1[1001], s2[1001];\n    scanf(\"%s %s\", s1, s2);\n\n    // TODO: print \"true\" if s1 and s2 are anagrams, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "listen\nsilent",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "hello\nworld",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "abc\ncab",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "a\na",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "aabbc\naabbb",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Find the Missing Number",
    "slug": "find-missing-number",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Math"
    ],
    "statement": "An array contains n distinct integers taken from the range 1 to n+1, with exactly one number missing. Print the missing number.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the missing number",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "4\n1 2 4 5",
        "output": "3",
        "explanation": "The range 1..5 is missing 3."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the missing number from the range 1..n+1\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the missing number from the range 1..n+1\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the missing number from the range 1..n+1\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the missing number from the range 1..n+1\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the missing number from the range 1..n+1\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 2 4 5",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "3\n2 3 4",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "1\n1",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "6",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Bubble Sort",
    "slug": "bubble-sort",
    "difficulty": "Medium",
    "topics": [
      "Sorting",
      "Arrays"
    ],
    "statement": "Given an array of integers, sort it in ascending order using bubble sort and print the result.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "n space-separated integers, sorted ascending",
    "constraints": "1 <= n <= 2000",
    "examples": [
      {
        "input": "5\n5 3 4 1 2",
        "output": "1 2 3 4 5",
        "explanation": "Sorted ascending."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: sort arr ascending using bubble sort and print it space separated\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: sort arr ascending using bubble sort and print it space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: sort arr ascending using bubble sort and print it space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: sort arr ascending using bubble sort and print it space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[2000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: sort arr ascending using bubble sort and print it space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n5 3 4 1 2",
        "expectedOutput": "1 2 3 4 5",
        "isHidden": false
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "1 2 3 4",
        "isHidden": true
      },
      {
        "input": "5\n3 1 3 2 1",
        "expectedOutput": "1 1 2 3 3",
        "isHidden": true
      },
      {
        "input": "6\n-5 -1 -10 0 3 -2",
        "expectedOutput": "-10 -5 -2 -1 0 3",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Find the Second Largest Element",
    "slug": "second-largest-element",
    "difficulty": "Medium",
    "topics": [
      "Arrays"
    ],
    "statement": "Given an array of distinct integers, print the second largest element.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated distinct integers",
    "outputFormat": "A single integer: the second largest value",
    "constraints": "2 <= n <= 100000, all elements distinct",
    "examples": [
      {
        "input": "5\n3 1 4 9 5",
        "output": "5",
        "explanation": "Largest is 9, second largest is 5."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the second largest element in arr\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the second largest element in arr\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the second largest element in arr\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the second largest element in arr\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the second largest element in arr\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n3 1 4 9 5",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "2\n10 20",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "input": "4\n-1 -2 -3 -4",
        "expectedOutput": "-2",
        "isHidden": true
      },
      {
        "input": "2\n-5 5",
        "expectedOutput": "-5",
        "isHidden": true
      },
      {
        "input": "6\n10 20 4 45 99 -1",
        "expectedOutput": "45",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating",
    "difficulty": "Medium",
    "topics": [
      "Strings",
      "Sliding Window"
    ],
    "statement": "Given a string, print the length of the longest substring without repeating characters.",
    "inputFormat": "Line 1: a string",
    "outputFormat": "A single integer: the length of the longest substring without repeating characters",
    "constraints": "1 <= length <= 100000",
    "examples": [
      {
        "input": "abcabcbb",
        "output": "3",
        "explanation": "\"abc\" is the longest substring without repeats."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the length of the longest substring of s without repeating characters\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the length of the longest substring of s without repeating characters\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the length of the longest substring of s without repeating characters\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the length of the longest substring of s without repeating characters\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100001];\n    scanf(\"%s\", s);\n\n    // TODO: print the length of the longest substring of s without repeating characters\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "abcabcbb",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "bbbbb",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "pwwkew",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "a",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "abcdef",
        "expectedOutput": "6",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Rotate Array by K Positions",
    "slug": "rotate-array",
    "difficulty": "Medium",
    "topics": [
      "Arrays"
    ],
    "statement": "Given an array and an integer k, rotate the array to the right by k positions and print the result.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "n space-separated integers, rotated right by k",
    "constraints": "1 <= n <= 100000, 0 <= k <= 10^9",
    "examples": [
      {
        "input": "5\n1 2 3 4 5\n2",
        "output": "4 5 1 2 3",
        "explanation": "Last 2 elements move to the front."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: rotate arr right by k positions and print it space separated\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: rotate arr right by k positions and print it space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int k = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: rotate arr right by k positions and print it space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long k; cin >> k;\n\n    // TODO: rotate arr right by k positions and print it space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    long long k;\n    scanf(\"%lld\", &k);\n\n    // TODO: rotate arr right by k positions and print it space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "4 5 1 2 3",
        "isHidden": false
      },
      {
        "input": "3\n1 2 3\n0",
        "expectedOutput": "1 2 3",
        "isHidden": false
      },
      {
        "input": "4\n1 2 3 4\n5",
        "expectedOutput": "4 1 2 3",
        "isHidden": true
      },
      {
        "input": "3\n1 2 3\n3",
        "expectedOutput": "1 2 3",
        "isHidden": true
      },
      {
        "input": "4\n1 2 3 4\n1000000001",
        "expectedOutput": "4 1 2 3",
        "isHidden": true
      }
    ]
  },
  {
    "title": "GCD and LCM of Two Numbers",
    "slug": "gcd-and-lcm",
    "difficulty": "Medium",
    "topics": [
      "Math"
    ],
    "statement": "Given two positive integers a and b, print their GCD and LCM, space-separated (GCD first).",
    "inputFormat": "Line 1: a b",
    "outputFormat": "\"gcd lcm\"",
    "constraints": "1 <= a, b <= 10^9",
    "examples": [
      {
        "input": "12 18",
        "output": "6 36",
        "explanation": "GCD(12,18)=6, LCM(12,18)=36."
      }
    ],
    "starterCode": {
      "python": "a, b = map(int, input().split())\n\n# TODO: print \"gcd lcm\" for a and b\n",
      "javascript": "const [a, b] = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ').map(Number);\n\n// TODO: print \"gcd lcm\" for a and b\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] parts = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int a = parts[0], b = parts[1];\n\n        // TODO: print \"gcd lcm\" for a and b\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b; cin >> a >> b;\n\n    // TODO: print \"gcd lcm\" for a and b\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long a, b;\n    scanf(\"%lld %lld\", &a, &b);\n\n    // TODO: print \"gcd lcm\" for a and b\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "12 18",
        "expectedOutput": "6 36",
        "isHidden": false
      },
      {
        "input": "7 13",
        "expectedOutput": "1 91",
        "isHidden": false
      },
      {
        "input": "100 75",
        "expectedOutput": "25 300",
        "isHidden": true
      },
      {
        "input": "5 5",
        "expectedOutput": "5 5",
        "isHidden": true
      },
      {
        "input": "1000000000 999999999",
        "expectedOutput": "1 999999999000000000",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Check Balanced Parentheses",
    "slug": "balanced-parentheses",
    "difficulty": "Medium",
    "topics": [
      "Stack",
      "Strings"
    ],
    "statement": "Given a string containing only the characters (){}[], print \"true\" if the brackets are balanced and properly nested, otherwise print \"false\".",
    "inputFormat": "Line 1: a string of ()[]{} characters",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= length <= 100000",
    "examples": [
      {
        "input": "{[()]}",
        "output": "true",
        "explanation": "Every bracket is properly closed and nested."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print \"true\" if the brackets in s are balanced, else \"false\"\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print \"true\" if the brackets in s are balanced, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print \"true\" if the brackets in s are balanced, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print \"true\" if the brackets in s are balanced, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100001];\n    scanf(\"%s\", s);\n\n    // TODO: print \"true\" if the brackets in s are balanced, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "{[()]}",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "{[(])}",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "(()",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "((()))",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": ")(",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Move Zeroes to End",
    "slug": "move-zeroes-to-end",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Two Pointers"
    ],
    "statement": "Given an array of integers, move all zeroes to the end while maintaining the relative order of the non-zero elements, then print the result.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "n space-separated integers with all zeroes moved to the end",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "5\n0 1 0 3 12",
        "output": "1 3 12 0 0",
        "explanation": "Non-zero elements keep their order; zeroes go last."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: move all zeroes in arr to the end (keep relative order of non-zeroes) and print it\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: move all zeroes in arr to the end (keep relative order of non-zeroes) and print it\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: move all zeroes in arr to the end (keep relative order of non-zeroes) and print it\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: move all zeroes in arr to the end (keep relative order of non-zeroes) and print it\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: move all zeroes in arr to the end (keep relative order of non-zeroes) and print it\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n0 1 0 3 12",
        "expectedOutput": "1 3 12 0 0",
        "isHidden": false
      },
      {
        "input": "3\n0 0 0",
        "expectedOutput": "0 0 0",
        "isHidden": false
      },
      {
        "input": "4\n4 0 5 0",
        "expectedOutput": "4 5 0 0",
        "isHidden": true
      },
      {
        "input": "1\n5",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Merge Two Sorted Arrays",
    "slug": "merge-two-sorted-arrays",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Two Pointers"
    ],
    "statement": "Given two sorted arrays, merge them into a single sorted array and print the result.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers (array A, sorted)\nLine 3: m\nLine 4: m space-separated integers (array B, sorted)",
    "outputFormat": "n+m space-separated integers: the merged, sorted array",
    "constraints": "1 <= n, m <= 100000",
    "examples": [
      {
        "input": "3\n1 3 5\n3\n2 4 6",
        "output": "1 2 3 4 5 6",
        "explanation": "Both arrays merged in sorted order."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narrA = list(map(int, input().split()))\nm = int(input())\narrB = list(map(int, input().split()))\n\n# TODO: merge arrA and arrB into one sorted array and print it space separated\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arrA = lines[1].trim().split(' ').map(Number);\nconst m = parseInt(lines[2]);\nconst arrB = lines[3].trim().split(' ').map(Number);\n\n// TODO: merge arrA and arrB into one sorted array and print it space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arrA = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int m = Integer.parseInt(sc.nextLine().trim());\n        int[] arrB = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: merge arrA and arrB into one sorted array and print it space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arrA(n);\n    for (int i = 0; i < n; i++) cin >> arrA[i];\n    int m; cin >> m;\n    vector<int> arrB(m);\n    for (int i = 0; i < m; i++) cin >> arrB[i];\n\n    // TODO: merge arrA and arrB into one sorted array and print it space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arrA[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arrA[i]);\n    int m;\n    scanf(\"%d\", &m);\n    int arrB[100000];\n    for (int i = 0; i < m; i++) scanf(\"%d\", &arrB[i]);\n\n    // TODO: merge arrA and arrB into one sorted array and print it space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n1 3 5\n3\n2 4 6",
        "expectedOutput": "1 2 3 4 5 6",
        "isHidden": false
      },
      {
        "input": "1\n5\n1\n3",
        "expectedOutput": "3 5",
        "isHidden": false
      },
      {
        "input": "4\n0 3 4 31\n3\n1 2 5",
        "expectedOutput": "0 1 2 3 4 5 31",
        "isHidden": true
      },
      {
        "input": "3\n1 2 2\n2\n2 3",
        "expectedOutput": "1 2 2 2 3",
        "isHidden": true
      },
      {
        "input": "2\n-5 -1\n2\n-3 0",
        "expectedOutput": "-5 -3 -1 0",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Longest Common Subsequence",
    "slug": "longest-common-subsequence",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming",
      "Strings"
    ],
    "statement": "Given two strings, print the length of their longest common subsequence (not necessarily contiguous).",
    "inputFormat": "Line 1: s1\nLine 2: s2",
    "outputFormat": "A single integer: the LCS length",
    "constraints": "1 <= length <= 1000",
    "examples": [
      {
        "input": "abcde\nace",
        "output": "3",
        "explanation": "\"ace\" is the longest common subsequence."
      }
    ],
    "starterCode": {
      "python": "s1 = input().strip()\ns2 = input().strip()\n\n# TODO: print the length of the longest common subsequence of s1 and s2\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst s1 = lines[0].trim();\nconst s2 = lines[1].trim();\n\n// TODO: print the length of the longest common subsequence of s1 and s2\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.nextLine().trim();\n        String s2 = sc.nextLine().trim();\n\n        // TODO: print the length of the longest common subsequence of s1 and s2\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n\n    // TODO: print the length of the longest common subsequence of s1 and s2\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s1[1001], s2[1001];\n    scanf(\"%s %s\", s1, s2);\n\n    // TODO: print the length of the longest common subsequence of s1 and s2\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "abcde\nace",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "abc\nabc",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "abc\ndef",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "a\na",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "abcbdab\nbdcaba",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Coin Change (Minimum Coins)",
    "slug": "coin-change-minimum-coins",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming"
    ],
    "statement": "Given n coin denominations and a target amount, print the minimum number of coins needed to make up that amount (each denomination can be used any number of times). If it is not possible, print -1.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated coin denominations\nLine 3: amount",
    "outputFormat": "A single integer: the minimum number of coins, or -1 if impossible",
    "constraints": "1 <= n <= 100, 0 <= amount <= 10000",
    "examples": [
      {
        "input": "3\n1 2 5\n11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1, using 3 coins."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\ncoins = list(map(int, input().split()))\namount = int(input())\n\n# TODO: print the minimum number of coins to make amount, or -1 if impossible\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst coins = lines[1].trim().split(' ').map(Number);\nconst amount = parseInt(lines[2]);\n\n// TODO: print the minimum number of coins to make amount, or -1 if impossible\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] coins = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int amount = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the minimum number of coins to make amount, or -1 if impossible\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> coins(n);\n    for (int i = 0; i < n; i++) cin >> coins[i];\n    int amount; cin >> amount;\n\n    // TODO: print the minimum number of coins to make amount, or -1 if impossible\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int coins[100];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &coins[i]);\n    int amount;\n    scanf(\"%d\", &amount);\n\n    // TODO: print the minimum number of coins to make amount, or -1 if impossible\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n1 2 5\n11",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "1\n2\n3",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "1\n1\n0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "3\n1 3 4\n6",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "2\n2 5\n1",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Kth Largest Element in an Array",
    "slug": "kth-largest-element",
    "difficulty": "Hard",
    "topics": [
      "Sorting",
      "Arrays"
    ],
    "statement": "Given an array of integers and an integer k, print the kth largest element (k=1 means the largest; duplicates count separately).",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "A single integer: the kth largest element",
    "constraints": "1 <= k <= n <= 100000",
    "examples": [
      {
        "input": "6\n3 2 1 5 6 4\n2",
        "output": "5",
        "explanation": "Sorted descending: 6,5,4,3,2,1. The 2nd is 5."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: print the kth largest element in arr (k=1 is the largest)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: print the kth largest element in arr (k=1 is the largest)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int k = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the kth largest element in arr (k=1 is the largest)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int k; cin >> k;\n\n    // TODO: print the kth largest element in arr (k=1 is the largest)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    int k;\n    scanf(\"%d\", &k);\n\n    // TODO: print the kth largest element in arr (k=1 is the largest)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\n3 2 1 5 6 4\n2",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "5\n3 2 3 1 2\n1",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "5\n3 2 3 1 2\n4",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "1\n7\n1",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "5\n5 5 5 5 5\n5",
        "expectedOutput": "5",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard",
    "topics": [
      "Arrays",
      "Two Pointers",
      "Dynamic Programming"
    ],
    "statement": "Given n non-negative integers representing an elevation map where the width of each bar is 1, print the total amount of rainwater that can be trapped between the bars.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers (bar heights)",
    "outputFormat": "A single integer: total trapped water",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        "output": "6",
        "explanation": "6 units of water are trapped between the bars."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nheights = list(map(int, input().split()))\n\n# TODO: print the total amount of rainwater trapped between the bars\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst heights = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the total amount of rainwater trapped between the bars\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] heights = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the total amount of rainwater trapped between the bars\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> heights(n);\n    for (int i = 0; i < n; i++) cin >> heights[i];\n\n    // TODO: print the total amount of rainwater trapped between the bars\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int heights[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &heights[i]);\n\n    // TODO: print the total amount of rainwater trapped between the bars\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "6\n4 2 0 3 2 5",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1\n5",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "5\n3 3 3 3 3",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming",
      "Arrays"
    ],
    "statement": "Given an array of integers, print the length of the longest strictly increasing subsequence.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the length of the longest strictly increasing subsequence",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "output": "4",
        "explanation": "One longest increasing subsequence is [2,3,7,18] or [2,3,7,101]."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the length of the longest strictly increasing subsequence of arr\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the length of the longest strictly increasing subsequence of arr\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the length of the longest strictly increasing subsequence of arr\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the length of the longest strictly increasing subsequence of arr\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the length of the longest strictly increasing subsequence of arr\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "6\n0 1 0 3 2 3",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "1\n7",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "6\n1 3 6 7 9 4",
        "expectedOutput": "5",
        "isHidden": true
      }
    ]
  },
  {
    "title": "Maximum Sum Subarray of Size K",
    "slug": "max-sum-subarray-size-k",
    "difficulty": "Easy",
    "topics": [
      "Sliding Window",
      "Arrays"
    ],
    "statement": "Given an array of n integers and an integer k, find the maximum sum of any contiguous subarray of size k.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "A single integer: the maximum sum of a contiguous subarray of size k",
    "constraints": "1 <= k <= n <= 100000",
    "examples": [
      {
        "input": "8\n2 1 5 1 3 2 1 4\n3",
        "output": "9",
        "explanation": "The window [5,1,3] has the largest sum, 9."
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "output": "9",
        "explanation": "The window [4,5] has the largest sum, 9."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: print the maximum sum of any contiguous subarray of size k, using a sliding window\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: print the maximum sum of any contiguous subarray of size k, using a sliding window\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long k = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the maximum sum of any contiguous subarray of size k, using a sliding window\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long k; cin >> k;\n\n    // TODO: print the maximum sum of any contiguous subarray of size k, using a sliding window\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long k;\n    scanf(\"%lld\", &k);\n\n    // TODO: print the maximum sum of any contiguous subarray of size k, using a sliding window\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "8\n2 1 5 1 3 2 1 4\n3",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "1\n7\n1",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "5\n-1 -2 -3 -4 -5\n2",
        "expectedOutput": "-3",
        "isHidden": true
      },
      {
        "input": "4\n1 2 3 4\n4",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "hints": [
      "A brute-force approach recomputes the sum of every window from scratch — that's O(n*k). Can you avoid recomputation?",
      "Maintain a running sum for the current window; when the window slides by one, subtract the element leaving and add the element entering.",
      "Track the best sum seen so far as you slide the window across the array in a single O(n) pass."
    ],
    "editorial": "Compute the sum of the first window of size k, then slide the window one element at a time: subtract the element that leaves and add the element that enters, updating the running maximum along the way. This avoids recomputing the sum for every window and runs in O(n) time with O(1) extra space, compared to the naive O(n*k) approach of summing each window independently."
  },
  {
    "title": "Range Sum Queries",
    "slug": "range-sum-queries",
    "difficulty": "Easy",
    "topics": [
      "Prefix Sum",
      "Arrays"
    ],
    "statement": "Given an array of n integers and q queries, each consisting of two 0-indexed positions l and r (inclusive), print the sum of arr[l..r] for every query, space-separated, on a single line.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: q\nNext q lines: l r",
    "outputFormat": "q space-separated integers: the answer to each query in order",
    "constraints": "1 <= n <= 100000, 1 <= q <= 1000, 0 <= l <= r < n",
    "examples": [
      {
        "input": "5\n1 2 3 4 5\n2\n0 2\n1 4",
        "output": "6 14",
        "explanation": "arr[0..2]=1+2+3=6, arr[1..4]=2+3+4+5=14."
      },
      {
        "input": "4\n10 20 30 40\n1\n0 3",
        "output": "100",
        "explanation": "Sum of the whole array is 100."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nq = int(input())\nqueries = [tuple(map(int, input().split())) for _ in range(q)]\n\n# TODO: build a prefix sum array, then answer each query in O(1) and print all answers space separated\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst q = parseInt(lines[2]);\nconst queries = [];\nfor (let i = 0; i < q; i++) queries.push(lines[3 + i].trim().split(' ').map(Number));\n\n// TODO: build a prefix sum array, then answer each query in O(1) and print all answers space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int q = Integer.parseInt(sc.nextLine().trim());\n        int[][] queries = new int[q][2];\n        for (int i = 0; i < q; i++) {\n            int[] lr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n            queries[i] = lr;\n        }\n\n        // TODO: build a prefix sum array, then answer each query in O(1) and print all answers space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int q; cin >> q;\n    vector<pair<int,int>> queries(q);\n    for (int i = 0; i < q; i++) cin >> queries[i].first >> queries[i].second;\n\n    // TODO: build a prefix sum array, then answer each query in O(1) and print all answers space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    int q;\n    scanf(\"%d\", &q);\n    int l, r;\n    for (int i = 0; i < q; i++) {\n        scanf(\"%d %d\", &l, &r);\n        // TODO: compute and store/print the answer for this query\n    }\n\n    // build a prefix sum array, then answer each query in O(1) and print all answers space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n2\n0 2\n1 4",
        "expectedOutput": "6 14",
        "isHidden": false
      },
      {
        "input": "4\n10 20 30 40\n1\n0 3",
        "expectedOutput": "100",
        "isHidden": false
      },
      {
        "input": "3\n5 5 5\n3\n0 0\n1 1\n0 2",
        "expectedOutput": "5 5 15",
        "isHidden": true
      },
      {
        "input": "4\n-1 -2 -3 -4\n2\n0 1\n0 3",
        "expectedOutput": "-3 -10",
        "isHidden": true
      },
      {
        "input": "1\n5\n1\n0 0",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "hints": [
      "Answering each query by summing arr[l..r] directly is O(n) per query — too slow if q and n are both large.",
      "Precompute a prefix sum array pre[] where pre[i] is the sum of the first i elements, so pre[0] = 0.",
      "The answer to a query (l, r) is pre[r+1] - pre[l], computed in O(1) per query."
    ],
    "editorial": "Build a prefix sum array pre of length n+1 where pre[i] holds the sum of arr[0..i-1]. Then the sum of any range [l, r] is simply pre[r+1] - pre[l], computed in constant time. Building the prefix array takes O(n), and each of the q queries is answered in O(1), giving O(n + q) total instead of O(n*q) for the naive approach."
  },
  {
    "title": "Count Set Bits",
    "slug": "count-set-bits",
    "difficulty": "Easy",
    "topics": [
      "Bit Manipulation"
    ],
    "statement": "Given a non-negative integer n, print the number of set bits (1s) in its binary representation.",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: the count of set bits",
    "constraints": "0 <= n <= 10^9",
    "examples": [
      {
        "input": "11",
        "output": "3",
        "explanation": "11 in binary is 1011, which has 3 set bits."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "0 has no set bits."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print the number of set bits (1s) in the binary representation of n\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print the number of set bits (1s) in the binary representation of n\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the number of set bits (1s) in the binary representation of n\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print the number of set bits (1s) in the binary representation of n\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print the number of set bits (1s) in the binary representation of n\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "1023",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "1000000000",
        "expectedOutput": "13",
        "isHidden": true
      },
      {
        "input": "536870912",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "You can check the lowest bit of n with n & 1, then shift n right to check the next bit.",
      "Repeat: count += n & 1; n >>= 1, until n becomes 0.",
      "Alternatively, use a language built-in like Python's bin(n).count('1') or Java's Integer.bitCount(n)."
    ],
    "editorial": "Repeatedly examine the lowest bit of n using n & 1, add it to a counter, and right-shift n by one bit until n becomes 0. Each iteration processes one bit, so the loop runs O(log n) times with O(1) extra space. Many languages also expose a built-in population-count function that does the same thing more concisely."
  },
  {
    "title": "Check Power of Two",
    "slug": "check-power-of-two",
    "difficulty": "Easy",
    "topics": [
      "Bit Manipulation",
      "Math"
    ],
    "statement": "Given an integer n, print \"true\" if n is a power of two (1, 2, 4, 8, ...), otherwise print \"false\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "0 <= n <= 10^9",
    "examples": [
      {
        "input": "16",
        "output": "true",
        "explanation": "16 = 2^4."
      },
      {
        "input": "18",
        "output": "false",
        "explanation": "18 is not a power of two."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print \"true\" if n is a power of two, else \"false\"\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print \"true\" if n is a power of two, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print \"true\" if n is a power of two, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print \"true\" if n is a power of two, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print \"true\" if n is a power of two, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "16",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "18",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "1",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "536870912",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "A power of two has exactly one set bit in its binary representation.",
      "For n > 0, the expression n & (n - 1) clears the lowest set bit — if the result is 0, n had only one set bit.",
      "Remember to special-case n = 0, which is not a power of two."
    ],
    "editorial": "A positive power of two has exactly one bit set in binary (e.g. 16 = 10000). The trick n & (n - 1) clears the lowest set bit of n; if n was a power of two, this leaves 0. So the check is n > 0 and (n & (n - 1)) == 0, which runs in O(1) time and space."
  },
  {
    "title": "Single Number (XOR)",
    "slug": "single-number-xor",
    "difficulty": "Easy",
    "topics": [
      "Bit Manipulation",
      "Arrays"
    ],
    "statement": "Given an array where every element appears exactly twice except for one element which appears exactly once, find that single element.",
    "inputFormat": "Line 1: n (odd)\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the element that appears only once",
    "constraints": "1 <= n <= 100000, n is odd",
    "examples": [
      {
        "input": "5\n4 1 2 1 2",
        "output": "4",
        "explanation": "4 is the only element that appears once."
      },
      {
        "input": "1\n7",
        "output": "7",
        "explanation": "The only element appears once."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the element that appears exactly once, using XOR\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the element that appears exactly once, using XOR\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the element that appears exactly once, using XOR\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the element that appears exactly once, using XOR\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the element that appears exactly once, using XOR\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n4 1 2 1 2",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "1\n7",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "7\n2 2 3 3 4 4 9",
        "expectedOutput": "9",
        "isHidden": true
      },
      {
        "input": "3\n-5 3 3",
        "expectedOutput": "-5",
        "isHidden": true
      },
      {
        "input": "9\n1 1 2 2 3 3 4 4 100",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "hints": [
      "A hash map counting occurrences works but uses O(n) extra space — can you do it in O(1) space?",
      "XOR has the property that x ^ x = 0 and x ^ 0 = x for any x.",
      "XOR all the elements together: every pair cancels out to 0, leaving only the element that appears once."
    ],
    "editorial": "XOR-ing every element of the array together causes each value that appears twice to cancel out (since x ^ x = 0), leaving only the value that appears once (since y ^ 0 = y). This single pass runs in O(n) time and O(1) extra space, which is optimal and avoids the O(n) space a hash-map counting approach would need."
  },
  {
    "title": "Matrix Transpose",
    "slug": "matrix-transpose",
    "difficulty": "Easy",
    "topics": [
      "Matrix",
      "Arrays"
    ],
    "statement": "Given an r x c matrix, print its transpose. Print the transposed matrix's elements in row-major order (row by row), all space-separated on a single line.",
    "inputFormat": "Line 1: r c\nNext r lines: c space-separated integers (the matrix, one row per line)",
    "outputFormat": "c*r space-separated integers: the transposed matrix in row-major order, on a single line",
    "constraints": "1 <= r, c <= 100",
    "examples": [
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "output": "1 4 2 5 3 6",
        "explanation": "Transpose of [[1,2,3],[4,5,6]] is [[1,4],[2,5],[3,6]], flattened row by row."
      },
      {
        "input": "1 1\n5",
        "output": "5",
        "explanation": "A 1x1 matrix's transpose is itself."
      }
    ],
    "starterCode": {
      "python": "r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\n\n# TODO: print the transpose of the matrix, in row-major order, space separated on one line\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [r, c] = lines[0].trim().split(' ').map(Number);\nconst matrix = [];\nfor (let i = 0; i < r; i++) matrix.push(lines[i + 1].trim().split(' ').map(Number));\n\n// TODO: print the transpose of the matrix, in row-major order, space separated on one line\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] rc = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int r = rc[0], c = rc[1];\n        int[][] matrix = new int[r][c];\n        for (int i = 0; i < r; i++) {\n            int[] row = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n            matrix[i] = row;\n        }\n\n        // TODO: print the transpose of the matrix, in row-major order, space separated on one line\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int r, c; cin >> r >> c;\n    vector<vector<int>> matrix(r, vector<int>(c));\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            cin >> matrix[i][j];\n\n    // TODO: print the transpose of the matrix, in row-major order, space separated on one line\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int r, c;\n    scanf(\"%d %d\", &r, &c);\n    int matrix[100][100];\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            scanf(\"%d\", &matrix[i][j]);\n\n    // TODO: print the transpose of the matrix, in row-major order, space separated on one line\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "expectedOutput": "1 4 2 5 3 6",
        "isHidden": false
      },
      {
        "input": "1 1\n5",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "3 2\n1 2\n3 4\n5 6",
        "expectedOutput": "1 3 5 2 4 6",
        "isHidden": true
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 3 2 4",
        "isHidden": true
      },
      {
        "input": "3 1\n1\n2\n3",
        "expectedOutput": "1 2 3",
        "isHidden": true
      }
    ],
    "hints": [
      "The transpose swaps rows and columns: element at (i, j) in the original goes to (j, i) in the transpose.",
      "Build a new c x r matrix where transposed[j][i] = matrix[i][j] for every valid i, j.",
      "Print the transposed matrix row by row, all values on one line, space-separated."
    ],
    "editorial": "The transpose of an r x c matrix is a c x r matrix where the element at row j, column i equals the original element at row i, column j. Iterate over every column j of the original matrix (which becomes a row of the transpose) and every row i, collecting matrix[i][j] in order. This takes O(r*c) time and O(r*c) space to build and print the result."
  },
  {
    "title": "Matrix Row Sums",
    "slug": "matrix-row-sums",
    "difficulty": "Easy",
    "topics": [
      "Matrix",
      "Arrays"
    ],
    "statement": "Given an r x c matrix, print the sum of each row, space-separated, in order from the first row to the last.",
    "inputFormat": "Line 1: r c\nNext r lines: c space-separated integers (the matrix, one row per line)",
    "outputFormat": "r space-separated integers: the sum of each row",
    "constraints": "1 <= r, c <= 1000",
    "examples": [
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "output": "6 15",
        "explanation": "Row 0 sums to 6, row 1 sums to 15."
      },
      {
        "input": "3 1\n5\n10\n-2",
        "output": "5 10 -2",
        "explanation": "Each row has one element, so the sums are the elements themselves."
      }
    ],
    "starterCode": {
      "python": "r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\n\n# TODO: print the sum of each row, space separated on one line\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [r, c] = lines[0].trim().split(' ').map(Number);\nconst matrix = [];\nfor (let i = 0; i < r; i++) matrix.push(lines[i + 1].trim().split(' ').map(Number));\n\n// TODO: print the sum of each row, space separated on one line\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] rc = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int r = rc[0], c = rc[1];\n        int[][] matrix = new int[r][c];\n        for (int i = 0; i < r; i++) {\n            int[] row = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n            matrix[i] = row;\n        }\n\n        // TODO: print the sum of each row, space separated on one line\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int r, c; cin >> r >> c;\n    vector<vector<int>> matrix(r, vector<int>(c));\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            cin >> matrix[i][j];\n\n    // TODO: print the sum of each row, space separated on one line\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int r, c;\n    scanf(\"%d %d\", &r, &c);\n    int matrix[1000][1000];\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            scanf(\"%d\", &matrix[i][j]);\n\n    // TODO: print the sum of each row, space separated on one line\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "expectedOutput": "6 15",
        "isHidden": false
      },
      {
        "input": "3 1\n5\n10\n-2",
        "expectedOutput": "5 10 -2",
        "isHidden": false
      },
      {
        "input": "1 4\n1 1 1 1",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "2 2\n-1 -2\n3 4",
        "expectedOutput": "-3 7",
        "isHidden": true
      },
      {
        "input": "1 1\n0",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "Process one row at a time and add up its elements.",
      "For each row, accumulate a running total across its c columns.",
      "Print the r row sums in order, space-separated on one line."
    ],
    "editorial": "For each of the r rows, sum its c elements with a simple loop, then print all r sums space-separated. This runs in O(r*c) time, which is optimal since every element must be read at least once, and uses O(1) extra space beyond the input."
  },
  {
    "title": "First Unique Character",
    "slug": "first-unique-character",
    "difficulty": "Easy",
    "topics": [
      "Strings",
      "Hash Map"
    ],
    "statement": "Given a string of lowercase letters, print the 0-indexed position of the first character that does not repeat anywhere else in the string. If every character repeats, print -1.",
    "inputFormat": "Line 1: a string of lowercase letters",
    "outputFormat": "A single integer: the index of the first non-repeating character, or -1",
    "constraints": "1 <= length <= 100000",
    "examples": [
      {
        "input": "leetcode",
        "output": "0",
        "explanation": "'l' at index 0 never repeats."
      },
      {
        "input": "loveleetcode",
        "output": "2",
        "explanation": "'v' at index 2 is the first character that never repeats."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the 0-indexed position of the first non-repeating character in s, or -1 if none\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the 0-indexed position of the first non-repeating character in s, or -1 if none\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the 0-indexed position of the first non-repeating character in s, or -1 if none\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the 0-indexed position of the first non-repeating character in s, or -1 if none\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100001];\n    scanf(\"%s\", s);\n\n    // TODO: print the 0-indexed position of the first non-repeating character in s, or -1 if none\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "leetcode",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "loveleetcode",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "aabb",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "z",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "abcabcde",
        "expectedOutput": "6",
        "isHidden": true
      }
    ],
    "hints": [
      "First count how many times each character occurs across the whole string.",
      "Use a hash map (or a fixed-size array of 26 counters, since letters are lowercase) to store frequencies.",
      "Scan the string a second time, left to right, and return the index of the first character whose count is exactly 1."
    ],
    "editorial": "First pass: build a frequency count of each character using a hash map or a 26-length array (since the alphabet is lowercase letters). Second pass: scan the string left to right and return the index of the first character whose count is exactly 1; if none is found, return -1. Both passes are O(n), so the total time is O(n) with O(1) extra space (bounded alphabet size)."
  },
  {
    "title": "GCD of an Array",
    "slug": "gcd-of-array",
    "difficulty": "Easy",
    "topics": [
      "Math",
      "Number Theory"
    ],
    "statement": "Given an array of n positive integers, print the greatest common divisor (GCD) of all the elements.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the GCD of all elements",
    "constraints": "1 <= n <= 100000, 1 <= arr[i] <= 10^9",
    "examples": [
      {
        "input": "4\n12 18 24 30",
        "output": "6",
        "explanation": "GCD(12, 18, 24, 30) = 6."
      },
      {
        "input": "3\n7 7 7",
        "output": "7",
        "explanation": "GCD of identical values is the value itself."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the GCD of all elements of arr\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the GCD of all elements of arr\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the GCD of all elements of arr\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the GCD of all elements of arr\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the GCD of all elements of arr\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n12 18 24 30",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "3\n7 7 7",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "2\n17 13",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "1\n42",
        "expectedOutput": "42",
        "isHidden": true
      },
      {
        "input": "5\n1000000000 1000000000 1000000000 1000000000 1000000000",
        "expectedOutput": "1000000000",
        "isHidden": true
      }
    ],
    "hints": [
      "The GCD of a list of numbers can be computed by folding the pairwise GCD across the array.",
      "gcd(a, b, c) == gcd(gcd(a, b), c), so accumulate the running GCD as you scan the array.",
      "Use the Euclidean algorithm (gcd(a, b) = gcd(b, a % b)) for each pairwise step."
    ],
    "editorial": "The GCD of a set of numbers can be built incrementally: start with running = arr[0], then for each subsequent element compute running = gcd(running, arr[i]) using the Euclidean algorithm. Since gcd(a, b) = gcd(b, a mod b) terminates in O(log(min(a,b))) steps, the whole array can be processed in O(n log(max value)) time with O(1) extra space."
  },
  {
    "title": "Check Perfect Number",
    "slug": "check-perfect-number",
    "difficulty": "Easy",
    "topics": [
      "Math",
      "Number Theory"
    ],
    "statement": "A perfect number is a positive integer that equals the sum of its proper positive divisors (all divisors excluding itself). Given n, print \"true\" if it is a perfect number, otherwise print \"false\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= n <= 10^7",
    "examples": [
      {
        "input": "28",
        "output": "true",
        "explanation": "1 + 2 + 4 + 7 + 14 = 28."
      },
      {
        "input": "12",
        "output": "false",
        "explanation": "1 + 2 + 3 + 4 + 6 = 16, which is not 12."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print \"true\" if n is a perfect number, else \"false\"\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print \"true\" if n is a perfect number, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print \"true\" if n is a perfect number, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print \"true\" if n is a perfect number, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print \"true\" if n is a perfect number, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "28",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "12",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "6",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "496",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "Summing every number from 1 to n-1 and checking divisibility is O(n) — too slow for n up to 10^7.",
      "Divisors come in pairs: if i divides n, so does n / i. You only need to check up to sqrt(n).",
      "For each i from 2 to sqrt(n) that divides n, add both i and n/i to the sum (careful not to double-count when i * i == n); don't forget to start the sum at 1 (since 1 is always a proper divisor for n > 1)."
    ],
    "editorial": "Instead of checking every number from 1 to n-1 (O(n)), only check divisors up to sqrt(n): whenever i divides n, both i and n/i are divisors, so add both to a running sum (taking care not to double-count when i equals n/i). Start the sum at 1, since 1 is always a proper divisor for n > 1. This reduces the time complexity to O(sqrt(n)), which comfortably handles n up to 10^7."
  },
  {
    "title": "Pascal's Triangle Row",
    "slug": "pascals-triangle-row",
    "difficulty": "Easy",
    "topics": [
      "Math",
      "Combinatorics"
    ],
    "statement": "Given a 0-indexed row number n, print the nth row of Pascal's triangle: the binomial coefficients C(n,0), C(n,1), ..., C(n,n), space-separated.",
    "inputFormat": "Line 1: n",
    "outputFormat": "n+1 space-separated integers: the nth row of Pascal's triangle",
    "constraints": "0 <= n <= 30",
    "examples": [
      {
        "input": "4",
        "output": "1 4 6 4 1",
        "explanation": "Row 4 of Pascal's triangle."
      },
      {
        "input": "0",
        "output": "1",
        "explanation": "Row 0 is just [1]."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print row n of Pascal's triangle (C(n,0) through C(n,n)), space separated\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print row n of Pascal's triangle (C(n,0) through C(n,n)), space separated\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print row n of Pascal's triangle (C(n,0) through C(n,n)), space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print row n of Pascal's triangle (C(n,0) through C(n,n)), space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print row n of Pascal's triangle (C(n,0) through C(n,n)), space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "1 4 6 4 1",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "5",
        "expectedOutput": "1 5 10 10 5 1",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1 1",
        "isHidden": true
      },
      {
        "input": "30",
        "expectedOutput": "1 30 435 4060 27405 142506 593775 2035800 5852925 14307150 30045015 54627300 86493225 119759850 145422675 155117520 145422675 119759850 86493225 54627300 30045015 14307150 5852925 2035800 593775 142506 27405 4060 435 30 1",
        "isHidden": true
      }
    ],
    "hints": [
      "Recomputing C(n, k) from scratch with factorials for every k works, but there's a simpler incremental way.",
      "Each entry can be derived from the previous one: C(n, k) = C(n, k-1) * (n - k + 1) / k.",
      "Start with C(n, 0) = 1 and build up the row left to right using that relation, keeping the running value as an integer."
    ],
    "editorial": "Rather than recomputing each binomial coefficient independently, build the row incrementally: starting from C(n, 0) = 1, each next entry is C(n, k) = C(n, k-1) * (n - k + 1) / k. Because this ratio is always an integer at each step, the running value stays exact when computed as (value * (n-k+1)) / k using integer arithmetic. This produces the entire row of n+1 entries in O(n) time and O(n) space."
  },
  {
    "title": "Two Sum II - Sorted Array",
    "slug": "two-sum-ii-sorted",
    "difficulty": "Easy",
    "topics": [
      "Two Pointers",
      "Arrays"
    ],
    "statement": "Given a 1-indexed array sorted in non-decreasing order and a target value, find the two numbers that add up to the target and print their 1-indexed positions, smaller index first. Exactly one solution exists, and you must use an O(n) two-pointer approach (not hashing) since the array is sorted.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers, sorted ascending\nLine 3: target",
    "outputFormat": "Two 1-indexed positions, space-separated, in ascending order",
    "constraints": "2 <= n <= 100000",
    "examples": [
      {
        "input": "4\n2 7 11 15\n9",
        "output": "1 2",
        "explanation": "arr[1] + arr[2] = 2 + 7 = 9 (1-indexed)."
      },
      {
        "input": "3\n2 3 4\n6",
        "output": "1 3",
        "explanation": "arr[1] + arr[3] = 2 + 4 = 6 (1-indexed)."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: print the 1-indexed positions of the two numbers that add up to target, using two pointers\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: print the 1-indexed positions of the two numbers that add up to target, using two pointers\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long target = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the 1-indexed positions of the two numbers that add up to target, using two pointers\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long target; cin >> target;\n\n    // TODO: print the 1-indexed positions of the two numbers that add up to target, using two pointers\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long target;\n    scanf(\"%lld\", &target);\n\n    // TODO: print the 1-indexed positions of the two numbers that add up to target, using two pointers\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n2 7 11 15\n9",
        "expectedOutput": "1 2",
        "isHidden": false
      },
      {
        "input": "3\n2 3 4\n6",
        "expectedOutput": "1 3",
        "isHidden": false
      },
      {
        "input": "6\n1 3 4 5 7 11\n9",
        "expectedOutput": "3 4",
        "isHidden": true
      },
      {
        "input": "4\n-3 -1 0 2\n-4",
        "expectedOutput": "1 2",
        "isHidden": true
      },
      {
        "input": "2\n1 5\n6",
        "expectedOutput": "1 2",
        "isHidden": true
      }
    ],
    "hints": [
      "The array is already sorted — that's a strong hint you shouldn't need a hash map here.",
      "Use two pointers, one starting at the beginning and one at the end of the array.",
      "If the sum of the two pointed elements is too small, move the left pointer right; if too large, move the right pointer left; if equal, you found your answer."
    ],
    "editorial": "Since the array is sorted, use two pointers starting at the two ends. If the sum at the pointers equals the target, report their positions. If the sum is smaller than the target, advance the left pointer to increase the sum; if it's larger, retreat the right pointer to decrease it. Each step moves one pointer strictly inward, so the whole scan finishes in O(n) time with O(1) extra space — better than a hash-map approach that would use O(n) space."
  },
  {
    "title": "Minimum Size Subarray Sum",
    "slug": "min-size-subarray-sum",
    "difficulty": "Medium",
    "topics": [
      "Sliding Window",
      "Arrays"
    ],
    "statement": "Given an array of positive integers and a target sum, find the minimal length of a contiguous subarray whose sum is greater than or equal to the target. If no such subarray exists, print 0.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated positive integers\nLine 3: target",
    "outputFormat": "A single integer: the minimal subarray length, or 0 if none exists",
    "constraints": "1 <= n <= 100000, 1 <= arr[i] <= 10000, 1 <= target <= 10^9",
    "examples": [
      {
        "input": "6\n2 3 1 2 4 3\n7",
        "output": "2",
        "explanation": "The subarray [4,3] has sum 7 and length 2, the shortest possible."
      },
      {
        "input": "3\n1 4 4\n4",
        "output": "1",
        "explanation": "The subarray [4] alone already meets the target."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: print the minimal length of a contiguous subarray with sum >= target, or 0 if none exists\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: print the minimal length of a contiguous subarray with sum >= target, or 0 if none exists\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long target = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the minimal length of a contiguous subarray with sum >= target, or 0 if none exists\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long target; cin >> target;\n\n    // TODO: print the minimal length of a contiguous subarray with sum >= target, or 0 if none exists\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long target;\n    scanf(\"%lld\", &target);\n\n    // TODO: print the minimal length of a contiguous subarray with sum >= target, or 0 if none exists\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\n2 3 1 2 4 3\n7",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3\n1 4 4\n4",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "8\n1 1 1 1 1 1 1 1\n11",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "5\n1 1 1 1 1\n5",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "hints": [
      "Checking every subarray's sum directly is O(n^2) — too slow for n up to 100000.",
      "Since all values are positive, a sliding window works: expand the window on the right, and shrink it from the left whenever the sum is already enough.",
      "Every time the current window's sum is >= target, record its length and try shrinking further before expanding again."
    ],
    "editorial": "Because all elements are positive, use a sliding window with two pointers: expand the right edge, adding to a running sum, and whenever the running sum reaches or exceeds the target, repeatedly shrink from the left (subtracting from the sum and advancing the left pointer) while updating the minimum length found. Each pointer only moves forward, so the total work is O(n) despite the nested-looking loop, compared to O(n^2) for checking every subarray directly."
  },
  {
    "title": "Subarray Sum Equals K",
    "slug": "subarray-sum-equals-k",
    "difficulty": "Medium",
    "topics": [
      "Prefix Sum",
      "Hash Map"
    ],
    "statement": "Given an array of integers (which may include negative numbers) and an integer k, print the total number of contiguous subarrays whose elements sum to exactly k.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "A single integer: the count of subarrays summing to k",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "3\n1 1 1\n2",
        "output": "2",
        "explanation": "The subarrays [1,1] (indices 0-1) and [1,1] (indices 1-2) both sum to 2."
      },
      {
        "input": "3\n1 2 3\n3",
        "output": "2",
        "explanation": "The subarrays [1,2] and [3] both sum to 3."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: print the number of contiguous subarrays whose sum equals k, using prefix sums and a hash map\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: print the number of contiguous subarrays whose sum equals k, using prefix sums and a hash map\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long k = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the number of contiguous subarrays whose sum equals k, using prefix sums and a hash map\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long k; cin >> k;\n\n    // TODO: print the number of contiguous subarrays whose sum equals k, using prefix sums and a hash map\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long k;\n    scanf(\"%lld\", &k);\n\n    // TODO: print the number of contiguous subarrays whose sum equals k, using prefix sums and a hash map\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n1 1 1\n2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3\n1 2 3\n3",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3\n1 -1 0\n0",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "1\n-5\n-5",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4\n0 0 0 0\n0",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "hints": [
      "Checking every subarray directly is O(n^2) — with negative numbers a sliding window doesn't directly apply.",
      "Track the running prefix sum as you scan left to right. A subarray (i+1..j) sums to k exactly when prefixSum[j] - prefixSum[i] == k.",
      "Use a hash map to count how many times each prefix sum value has occurred so far; for each new prefix sum, add the count of (prefixSum - k) seen previously."
    ],
    "editorial": "Maintain a running prefix sum while scanning the array once, and a hash map counting how many times each prefix sum value has been seen so far (initialized with {0: 1} to handle subarrays starting at index 0). At each position, the number of previous prefix sums equal to (currentPrefixSum - k) tells you how many subarrays ending here sum to k, since prefixSum[j] - prefixSum[i] = k. Add that count to the answer, then record the current prefix sum in the map. This runs in O(n) time and O(n) space, versus O(n^2) for the brute-force approach."
  },
  {
    "title": "Next Greater Element",
    "slug": "next-greater-element",
    "difficulty": "Medium",
    "topics": [
      "Stack",
      "Arrays"
    ],
    "statement": "Given an array of integers, for each element find the next element to its right that is strictly greater than it. If no such element exists, use -1. Print all n results space-separated, in order.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "n space-separated integers: the next greater element for each position, or -1",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "5\n4 5 2 10 8",
        "output": "5 10 10 -1 -1",
        "explanation": "For 4 -> 5, for 5 -> 10, for 2 -> 10, for 10 and 8 there is nothing greater to the right."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "2 3 4 -1",
        "explanation": "Each element's next greater is the one right after it, except the last."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print, for each element, the next strictly greater element to its right (or -1), using a monotonic stack\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print, for each element, the next strictly greater element to its right (or -1), using a monotonic stack\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print, for each element, the next strictly greater element to its right (or -1), using a monotonic stack\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print, for each element, the next strictly greater element to its right (or -1), using a monotonic stack\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print, for each element, the next strictly greater element to its right (or -1), using a monotonic stack\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n4 5 2 10 8",
        "expectedOutput": "5 10 10 -1 -1",
        "isHidden": false
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "2 3 4 -1",
        "isHidden": false
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "-1 -1 -1 -1 -1",
        "isHidden": true
      },
      {
        "input": "1\n5",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "5\n2 2 2 2 3",
        "expectedOutput": "3 3 3 3 -1",
        "isHidden": true
      }
    ],
    "hints": [
      "Comparing every element to every element after it is O(n^2) — can you find each answer in amortized O(1)?",
      "Use a stack that holds indices of elements still waiting for their next greater element, kept in decreasing order of value from bottom to top.",
      "As you scan left to right, whenever the current element is greater than the value at the index on top of the stack, pop it and record the current element as its answer."
    ],
    "editorial": "Scan the array left to right while maintaining a stack of indices whose next-greater element hasn't been found yet. For each new element, pop indices off the stack whenever the element at that index is smaller than the current one, recording the current value as their answer; then push the current index. Any index still on the stack at the end has no next greater element, so its answer is -1. Each index is pushed and popped at most once, so the total work is O(n), compared to O(n^2) for the brute-force pairwise comparison."
  },
  {
    "title": "Non-overlapping Intervals",
    "slug": "non-overlapping-intervals",
    "difficulty": "Medium",
    "topics": [
      "Greedy",
      "Sorting"
    ],
    "statement": "Given n intervals, each with a start and end, print the minimum number of intervals you need to remove so that the remaining intervals do not overlap. Intervals that only touch at an endpoint (one ends exactly where another begins) are not considered overlapping.",
    "inputFormat": "Line 1: n\nNext n lines: start end",
    "outputFormat": "A single integer: the minimum number of intervals to remove",
    "constraints": "1 <= n <= 100000, all start and end values fit in a 32-bit integer, start < end for every interval",
    "examples": [
      {
        "input": "4\n1 2\n2 3\n3 4\n1 3",
        "output": "1",
        "explanation": "Removing [1,3] leaves [1,2],[2,3],[3,4], which do not overlap."
      },
      {
        "input": "3\n1 2\n1 2\n1 2",
        "output": "2",
        "explanation": "Only one of the three identical intervals can be kept."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# TODO: print the minimum number of intervals to remove so none overlap, using a greedy approach sorted by end time\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst intervals = [];\nfor (let i = 0; i < n; i++) intervals.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the minimum number of intervals to remove so none overlap, using a greedy approach sorted by end time\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[][] intervals = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            int[] se = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n            intervals[i] = se;\n        }\n\n        // TODO: print the minimum number of intervals to remove so none overlap, using a greedy approach sorted by end time\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<pair<int,int>> intervals(n);\n    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;\n\n    // TODO: print the minimum number of intervals to remove so none overlap, using a greedy approach sorted by end time\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int start[100000], end_[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &start[i], &end_[i]);\n\n    // TODO: print the minimum number of intervals to remove so none overlap, using a greedy approach sorted by end time\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 2\n2 3\n3 4\n1 3",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "3\n1 2\n1 2\n1 2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "4\n1 100\n11 22\n1 11\n2 12",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "1\n0 5",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "3\n1 2\n3 4\n5 6",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "This is a classic interval scheduling problem — think about which interval to keep whenever two overlap.",
      "Sort the intervals by their end time. Greedily keep an interval if its start is not before the end of the last interval you kept.",
      "Whenever an interval's start is before the last kept interval's end, it overlaps, so it must be removed — count it and don't update the last-kept end."
    ],
    "editorial": "Sort the intervals by end time, then greedily walk through them keeping track of the end of the last interval kept. For each interval, if its start is at or after that end, keep it and update the tracked end; otherwise it overlaps with what's kept so far, so count it as removed. Choosing the interval with the smallest end time at each step maximizes the number of non-overlapping intervals that can be kept, which is the standard greedy-exchange argument for interval scheduling. Sorting takes O(n log n) and the single pass after that is O(n)."
  },
  {
    "title": "Minimum Meeting Rooms",
    "slug": "minimum-meeting-rooms",
    "difficulty": "Medium",
    "topics": [
      "Greedy",
      "Sorting"
    ],
    "statement": "Given n meetings, each with a start and end time, print the minimum number of meeting rooms required so that all meetings can be held without conflicts. A room can host a new meeting the instant a previous meeting in it ends.",
    "inputFormat": "Line 1: n\nNext n lines: start end",
    "outputFormat": "A single integer: the minimum number of rooms required",
    "constraints": "1 <= n <= 100000, 0 <= start < end <= 10^9",
    "examples": [
      {
        "input": "3\n0 30\n5 10\n15 20",
        "output": "2",
        "explanation": "[0,30] overlaps with both [5,10] and [15,20], so 2 rooms are needed."
      },
      {
        "input": "2\n7 10\n2 4",
        "output": "1",
        "explanation": "The meetings don't overlap, so 1 room suffices."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# TODO: print the minimum number of meeting rooms needed, by sweeping sorted start and end times\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst intervals = [];\nfor (let i = 0; i < n; i++) intervals.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the minimum number of meeting rooms needed, by sweeping sorted start and end times\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[][] intervals = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            int[] se = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n            intervals[i] = se;\n        }\n\n        // TODO: print the minimum number of meeting rooms needed, by sweeping sorted start and end times\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<pair<int,int>> intervals(n);\n    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;\n\n    // TODO: print the minimum number of meeting rooms needed, by sweeping sorted start and end times\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int start[100000], end_[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &start[i], &end_[i]);\n\n    // TODO: print the minimum number of meeting rooms needed, by sweeping sorted start and end times\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n0 30\n5 10\n15 20",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "2\n7 10\n2 4",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "3\n1 5\n8 9\n8 9",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "1\n0 10",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4\n0 10\n0 10\n0 10\n0 10",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "The answer equals the maximum number of meetings happening at the same instant, at any point in time.",
      "Separate the start times and end times into two sorted arrays.",
      "Sweep through both sorted arrays together: every start before the earliest still-open end increases the room count, and every end frees up a room."
    ],
    "editorial": "Sort all start times and all end times independently. Then sweep through them with two pointers: whenever the next start time is earlier than the next end time, a new room is needed (increment and track the running maximum); otherwise a room frees up (a meeting ends before or when the next one starts, so decrement the room count and advance the end pointer). The peak value reached during this sweep is the minimum number of rooms required. Sorting costs O(n log n) and the sweep is O(n)."
  },
  {
    "title": "Count Subsets with Given Sum",
    "slug": "count-subsets-with-sum",
    "difficulty": "Medium",
    "topics": [
      "Dynamic Programming",
      "Backtracking"
    ],
    "statement": "Given an array of n non-negative integers and a target sum, print the number of subsets (chosen by index; two subsets using different copies of an equal value count separately) whose elements sum to exactly the target.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated non-negative integers\nLine 3: target",
    "outputFormat": "A single integer: the number of subsets summing to target",
    "constraints": "1 <= n <= 20, 0 <= arr[i] <= 1000, 0 <= target <= 10000",
    "examples": [
      {
        "input": "4\n1 2 3 3\n6",
        "output": "3",
        "explanation": "The subsets {3,3}, {1,2,3(first)}, and {1,2,3(second)} all sum to 6."
      },
      {
        "input": "4\n1 1 1 1\n2",
        "output": "6",
        "explanation": "Any 2 of the four 1's sum to 2; there are C(4,2)=6 such pairs of indices."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: print the number of subsets (by index) of arr that sum to target, using backtracking or DP\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: print the number of subsets (by index) of arr that sum to target, using backtracking or DP\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long target = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the number of subsets (by index) of arr that sum to target, using backtracking or DP\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long target; cin >> target;\n\n    // TODO: print the number of subsets (by index) of arr that sum to target, using backtracking or DP\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long target;\n    scanf(\"%lld\", &target);\n\n    // TODO: print the number of subsets (by index) of arr that sum to target, using backtracking or DP\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 2 3 3\n6",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "4\n1 1 1 1\n2",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "3\n2 3 5\n5",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "3\n1 2 3\n0",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "3\n0 0 5\n5",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "With n <= 20, exploring all 2^n subsets directly is feasible, but you can be smarter with recursion or DP.",
      "For each element, you have two choices: include it in the subset or exclude it. Recurse on both, tracking the remaining target.",
      "To avoid recomputation, use dynamic programming: dp[i][s] = number of ways to reach sum s using the first i elements, with dp[i][s] = dp[i-1][s] + dp[i-1][s-arr[i-1]] (only if arr[i-1] <= s)."
    ],
    "editorial": "This is a counting variant of the subset-sum problem. Define dp[i][s] as the number of ways to pick a subset of the first i elements that sums to s: dp[i][s] = dp[i-1][s] (exclude element i) + dp[i-1][s - arr[i-1]] (include it, only when arr[i-1] <= s), with dp[0][0] = 1 as the base case. The answer is dp[n][target]. This runs in O(n * target) time and space, which is efficient enough given the constraints, and is equivalent to a memoized backtracking search over include/exclude choices for each index."
  },
  {
    "title": "BFS Shortest Path",
    "slug": "bfs-shortest-path",
    "difficulty": "Medium",
    "topics": [
      "Graph",
      "BFS"
    ],
    "statement": "Given an undirected, unweighted graph with n nodes (0-indexed) and m edges, and a source node s and destination node d, print the length (number of edges) of the shortest path from s to d. If d is unreachable from s, print -1.",
    "inputFormat": "Line 1: n m\nNext m lines: u v (an edge between u and v)\nLast line: s d",
    "outputFormat": "A single integer: the shortest path length, or -1 if unreachable",
    "constraints": "1 <= n <= 100000, 0 <= m <= 200000, 0 <= u, v, s, d < n",
    "examples": [
      {
        "input": "5 4\n0 1\n1 2\n2 3\n3 4\n0 4",
        "output": "4",
        "explanation": "The only path from 0 to 4 goes through every edge, length 4."
      },
      {
        "input": "4 2\n0 1\n2 3\n0 3",
        "output": "-1",
        "explanation": "Nodes {0,1} and {2,3} are in separate components."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\ns, d = map(int, input().split())\n\n# TODO: build an adjacency list and run BFS from s to find the shortest distance to d, or print -1 if unreachable\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\nconst [s, d] = lines[1 + m].trim().split(' ').map(Number);\n\n// TODO: build an adjacency list and run BFS from s to find the shortest distance to d, or print -1 if unreachable\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] nm = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int n = nm[0], m = nm[1];\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) edges[i] = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int[] sd = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int s = sd[0], d = sd[1];\n\n        // TODO: build an adjacency list and run BFS from s to find the shortest distance to d, or print -1 if unreachable\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<pair<int,int>> edges(m);\n    for (int i = 0; i < m; i++) cin >> edges[i].first >> edges[i].second;\n    int s, d; cin >> s >> d;\n\n    // TODO: build an adjacency list and run BFS from s to find the shortest distance to d, or print -1 if unreachable\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int eu[200000], ev[200000];\n    for (int i = 0; i < m; i++) scanf(\"%d %d\", &eu[i], &ev[i]);\n    int s, d;\n    scanf(\"%d %d\", &s, &d);\n\n    // TODO: build an adjacency list and run BFS from s to find the shortest distance to d, or print -1 if unreachable\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5 4\n0 1\n1 2\n2 3\n3 4\n0 4",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "4 2\n0 1\n2 3\n0 3",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "6 6\n0 1\n0 2\n1 3\n2 3\n3 4\n4 5\n0 5",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "3 2\n0 1\n1 2\n0 0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "3 1\n0 1\n0 2",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "hints": [
      "In an unweighted graph, the shortest path in terms of number of edges is exactly what breadth-first search discovers first.",
      "Build an adjacency list from the edge list, then run BFS starting from s, tracking the distance to each visited node.",
      "The first time BFS reaches d, that distance is the answer; if BFS finishes without ever reaching d, it's unreachable."
    ],
    "editorial": "Build an adjacency list from the m edges (each edge added both ways since the graph is undirected), then run a standard BFS from the source node s, tracking the distance to each node as it's first discovered. Because BFS explores nodes in order of increasing distance from the source, the first time it reaches d gives the shortest path length; if d is never reached, it is unreachable and the answer is -1. This runs in O(n + m) time and space."
  },
  {
    "title": "Count Connected Components",
    "slug": "count-connected-components",
    "difficulty": "Medium",
    "topics": [
      "Graph",
      "DFS"
    ],
    "statement": "Given an undirected graph with n nodes (0-indexed) and m edges, print the number of connected components in the graph.",
    "inputFormat": "Line 1: n m\nNext m lines: u v (an edge between u and v)",
    "outputFormat": "A single integer: the number of connected components",
    "constraints": "1 <= n <= 100000, 0 <= m <= 200000, 0 <= u, v < n",
    "examples": [
      {
        "input": "5 2\n0 1\n2 3",
        "output": "3",
        "explanation": "Components are {0,1}, {2,3}, and {4}."
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3",
        "output": "1",
        "explanation": "All 4 nodes form a single chain."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# TODO: print the number of connected components in the graph, using DFS or BFS or union-find\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the number of connected components in the graph, using DFS or BFS or union-find\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] nm = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int n = nm[0], m = nm[1];\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) edges[i] = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the number of connected components in the graph, using DFS or BFS or union-find\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<pair<int,int>> edges(m);\n    for (int i = 0; i < m; i++) cin >> edges[i].first >> edges[i].second;\n\n    // TODO: print the number of connected components in the graph, using DFS or BFS or union-find\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int eu[200000], ev[200000];\n    for (int i = 0; i < m; i++) scanf(\"%d %d\", &eu[i], &ev[i]);\n\n    // TODO: print the number of connected components in the graph, using DFS or BFS or union-find\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5 2\n0 1\n2 3",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "1 0",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4 0",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "4 4\n0 1\n1 2\n2 3\n3 0",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Build an adjacency list from the edges, then think about how to visit every node reachable from a given starting node.",
      "Run DFS (or BFS) from every unvisited node; each time you start a fresh traversal from an unvisited node, that's one new component.",
      "Alternatively, use union-find (disjoint set union): union the endpoints of every edge, then count the number of distinct root parents among all n nodes."
    ],
    "editorial": "Build an adjacency list from the edges, then iterate over all n nodes; whenever an unvisited node is found, it starts a new component, so run a DFS or BFS from it to mark every node reachable from it as visited, and increment the component count. This visits every node and edge at most once, giving O(n + m) time. A union-find (disjoint set union) approach also works: union the endpoints of every edge, then count the number of distinct roots among all n nodes, giving nearly O(n + m) time as well."
  },
  {
    "title": "Smallest Divisor Given a Threshold",
    "slug": "smallest-divisor-threshold",
    "difficulty": "Medium",
    "topics": [
      "Binary Search",
      "Arrays"
    ],
    "statement": "Given an array of n positive integers and an integer threshold, find the smallest positive integer divisor such that the sum of ceil(arr[i] / divisor) over all elements is less than or equal to threshold.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated positive integers\nLine 3: threshold",
    "outputFormat": "A single integer: the smallest valid divisor",
    "constraints": "1 <= n <= threshold <= 10^6, 1 <= arr[i] <= 10^6",
    "examples": [
      {
        "input": "4\n1 2 5 9\n6",
        "output": "5",
        "explanation": "With divisor 5: ceil(1/5)+ceil(2/5)+ceil(5/5)+ceil(9/5) = 1+1+1+2 = 5 <= 6, and 4 does not satisfy the condition."
      },
      {
        "input": "5\n44 22 33 11 1\n5",
        "output": "44",
        "explanation": "Only a large divisor brings the sum of ceilings down to 5 or fewer."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nthreshold = int(input())\n\n# TODO: binary search on the divisor value to find the smallest one whose ceiling-sum is <= threshold\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst threshold = parseInt(lines[2]);\n\n// TODO: binary search on the divisor value to find the smallest one whose ceiling-sum is <= threshold\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long threshold = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: binary search on the divisor value to find the smallest one whose ceiling-sum is <= threshold\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long threshold; cin >> threshold;\n\n    // TODO: binary search on the divisor value to find the smallest one whose ceiling-sum is <= threshold\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long threshold;\n    scanf(\"%lld\", &threshold);\n\n    // TODO: binary search on the divisor value to find the smallest one whose ceiling-sum is <= threshold\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 2 5 9\n6",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "5\n44 22 33 11 1\n5",
        "expectedOutput": "44",
        "isHidden": false
      },
      {
        "input": "5\n2 3 5 7 11\n11",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "3\n1 1 1\n3",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "1\n7\n1",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "hints": [
      "As the divisor increases, the sum of ceil(arr[i]/divisor) can only decrease or stay the same — this monotonic relationship is the key.",
      "Because of that monotonicity, you can binary search on the divisor value itself, from 1 up to the maximum array element.",
      "For a candidate divisor, compute the sum of ceilings in O(n); if it's <= threshold, try smaller divisors, otherwise try larger ones."
    ],
    "editorial": "The sum of ceil(arr[i] / divisor) is a monotonically non-increasing function of the divisor, so binary search on the divisor value works: search the range [1, max(arr)]. For each candidate mid, compute cost(mid) = sum of ceil(arr[i] / mid) in O(n); if cost(mid) <= threshold the divisor is feasible so search smaller values (hi = mid), otherwise search larger ones (lo = mid + 1). This is a classic 'binary search on the answer' pattern, running in O(n log(max value)) time overall instead of testing every possible divisor linearly."
  },
  {
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium",
    "topics": [
      "Matrix",
      "Graph",
      "DFS"
    ],
    "statement": "Given an r x c grid of '0's (water) and '1's (land), print the number of islands. An island is formed by connecting adjacent lands horizontally or vertically (not diagonally) and is surrounded by water.",
    "inputFormat": "Line 1: r c\nNext r lines: a string of '0'/'1' characters of length c",
    "outputFormat": "A single integer: the number of islands",
    "constraints": "1 <= r, c <= 300",
    "examples": [
      {
        "input": "4 5\n11000\n11000\n00100\n00011",
        "output": "3",
        "explanation": "There are three separate groups of connected land cells."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "A single land cell is one island."
      }
    ],
    "starterCode": {
      "python": "r, c = map(int, input().split())\ngrid = [input().strip() for _ in range(r)]\n\n# TODO: print the number of islands (connected groups of '1' cells) in the grid, using DFS or BFS flood fill\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [r, c] = lines[0].trim().split(' ').map(Number);\nconst grid = [];\nfor (let i = 0; i < r; i++) grid.push(lines[i + 1].trim());\n\n// TODO: print the number of islands (connected groups of '1' cells) in the grid, using DFS or BFS flood fill\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] rc = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int r = rc[0], c = rc[1];\n        String[] grid = new String[r];\n        for (int i = 0; i < r; i++) grid[i] = sc.nextLine().trim();\n\n        // TODO: print the number of islands (connected groups of '1' cells) in the grid, using DFS or BFS flood fill\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int r, c; cin >> r >> c;\n    vector<string> grid(r);\n    for (int i = 0; i < r; i++) cin >> grid[i];\n\n    // TODO: print the number of islands (connected groups of '1' cells) in the grid, using DFS or BFS flood fill\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int r, c;\n    scanf(\"%d %d\", &r, &c);\n    char grid[300][300];\n    for (int i = 0; i < r; i++) scanf(\"%s\", grid[i]);\n\n    // TODO: print the number of islands (connected groups of '1' cells) in the grid, using DFS or BFS flood fill\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4 5\n11000\n11000\n00100\n00011",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "3 3\n101\n000\n101",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "2 2\n00\n00",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "2 3\n111\n111",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Think of each land cell as a node in a graph, connected to its up/down/left/right land neighbors.",
      "Scan every cell; whenever you find an unvisited land cell, that's the start of a new island.",
      "From that cell, flood-fill (DFS or BFS) to mark every connected land cell as visited before continuing the scan, and increment your island counter once per flood-fill."
    ],
    "editorial": "Scan the grid cell by cell. Whenever an unvisited '1' cell is found, it marks the discovery of a new island: increment the island count and perform a flood fill (DFS or BFS, using a stack, queue, or recursion) that visits every land cell reachable from it via up/down/left/right moves, marking each as visited so it's never counted again. Since each cell is visited a constant number of times, the total time is O(r*c), the same as the size of the grid."
  },
  {
    "title": "nCr Modulo p",
    "slug": "ncr-mod-p",
    "difficulty": "Medium",
    "topics": [
      "Combinatorics",
      "Math"
    ],
    "statement": "Given two integers n and r, print the binomial coefficient C(n, r) — the number of ways to choose r items from n — modulo 1,000,000,007.",
    "inputFormat": "Line 1: n r",
    "outputFormat": "A single integer: C(n, r) mod 1000000007",
    "constraints": "0 <= r <= n <= 10^6",
    "examples": [
      {
        "input": "5 2",
        "output": "10",
        "explanation": "C(5,2) = 10."
      },
      {
        "input": "10 0",
        "output": "1",
        "explanation": "There is exactly one way to choose 0 items."
      }
    ],
    "starterCode": {
      "python": "n, r = map(int, input().split())\n\n# TODO: print C(n, r) mod 1000000007, using factorials with modular inverse\n",
      "javascript": "const [n, r] = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ').map(Number);\n\n// TODO: print C(n, r) mod 1000000007, using factorials with modular inverse\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] parts = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int n = parts[0], r = parts[1];\n\n        // TODO: print C(n, r) mod 1000000007, using factorials with modular inverse\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n, r; cin >> n >> r;\n\n    // TODO: print C(n, r) mod 1000000007, using factorials with modular inverse\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n, r;\n    scanf(\"%lld %lld\", &n, &r);\n\n    // TODO: print C(n, r) mod 1000000007, using factorials with modular inverse\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5 2",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "input": "10 0",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "1000 500",
        "expectedOutput": "159835829",
        "isHidden": true
      },
      {
        "input": "7 7",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "0 0",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Computing n! directly overflows for n as large as 10^6, so all arithmetic must be done modulo 1000000007 as you go.",
      "C(n, r) = n! / (r! * (n-r)!). Under a prime modulus, division becomes multiplication by the modular inverse.",
      "Precompute factorials modulo p up to n, then use Fermat's little theorem (inverse of x is x^(p-2) mod p) to compute the modular inverse of r! * (n-r)!."
    ],
    "editorial": "Precompute factorials modulo p = 1000000007 for all values from 0 to n in O(n) time. Then C(n, r) = fact[n] * inverse(fact[r]) * inverse(fact[n-r]) mod p, where the modular inverse of a value x modulo the prime p is computed as x^(p-2) mod p via Fermat's little theorem (using fast exponentiation, O(log p) per inverse). This avoids ever computing n! directly (which would overflow), and answers the query in O(n + log p) time overall."
  },
  {
    "title": "Count Pairs with Given XOR",
    "slug": "count-pairs-with-xor",
    "difficulty": "Medium",
    "topics": [
      "Bit Manipulation",
      "Hash Map"
    ],
    "statement": "Given an array of n integers and an integer k, print the number of pairs of indices (i, j) with i < j such that arr[i] XOR arr[j] equals k.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "A single integer: the count of valid pairs",
    "constraints": "1 <= n <= 100000, 0 <= arr[i], k <= 10^6",
    "examples": [
      {
        "input": "6\n5 4 10 15 7 6\n5",
        "output": "1",
        "explanation": "Only the pair (10, 15) has XOR equal to 5 (10 ^ 15 = 5)."
      },
      {
        "input": "7\n3 6 5 0 7 2 1\n2",
        "output": "3",
        "explanation": "Three pairs in the array XOR to 2."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: print the number of index pairs (i<j) whose values XOR to k, using a hash map\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: print the number of index pairs (i<j) whose values XOR to k, using a hash map\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long k = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the number of index pairs (i<j) whose values XOR to k, using a hash map\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long k; cin >> k;\n\n    // TODO: print the number of index pairs (i<j) whose values XOR to k, using a hash map\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long k;\n    scanf(\"%lld\", &k);\n\n    // TODO: print the number of index pairs (i<j) whose values XOR to k, using a hash map\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\n5 4 10 15 7 6\n5",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "7\n3 6 5 0 7 2 1\n2",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4\n1 1 1 2\n0",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "1\n5\n0",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "Checking every pair directly is O(n^2) — with n up to 100000 that's too slow.",
      "Note that arr[i] XOR arr[j] == k is equivalent to arr[j] == arr[i] XOR k.",
      "Scan the array once, keeping a running hash map of values seen so far; for each new element x, add the count of (x XOR k) already in the map, then add x to the map."
    ],
    "editorial": "Since a XOR b = k is equivalent to b = a XOR k, scan the array once while maintaining a hash map of value -> count of elements seen so far. For each new element x, the number of earlier elements that pair with it to XOR to k is exactly the count of (x XOR k) already recorded in the map; add that to the running total, then increment the count of x in the map. This finds all pairs in a single O(n) pass (with O(1) average hash map operations), instead of the O(n^2) brute-force comparison of every pair."
  },
  {
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "difficulty": "Hard",
    "topics": [
      "Sliding Window",
      "Stack"
    ],
    "statement": "Given an array of n integers and a window size k, print the maximum value in each contiguous window of size k as the window slides from left to right, space-separated, in order. There are n - k + 1 windows.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers\nLine 3: k",
    "outputFormat": "n-k+1 space-separated integers: the maximum of each window, in order",
    "constraints": "1 <= k <= n <= 100000",
    "examples": [
      {
        "input": "8\n1 3 -1 -3 5 3 6 7\n3",
        "output": "3 3 5 5 6 7",
        "explanation": "The maximum of each window of size 3, sliding across the array."
      },
      {
        "input": "2\n9 11\n2",
        "output": "11",
        "explanation": "There is only one window, containing both elements."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\nk = int(input())\n\n# TODO: print the maximum of every window of size k, in order, using a monotonic deque for O(n) total time\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst k = parseInt(lines[2]);\n\n// TODO: print the maximum of every window of size k, in order, using a monotonic deque for O(n) total time\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        long k = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print the maximum of every window of size k, in order, using a monotonic deque for O(n) total time\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    long long k; cin >> k;\n\n    // TODO: print the maximum of every window of size k, in order, using a monotonic deque for O(n) total time\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n    long long k;\n    scanf(\"%lld\", &k);\n\n    // TODO: print the maximum of every window of size k, in order, using a monotonic deque for O(n) total time\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "8\n1 3 -1 -3 5 3 6 7\n3",
        "expectedOutput": "3 3 5 5 6 7",
        "isHidden": false
      },
      {
        "input": "2\n9 11\n2",
        "expectedOutput": "11",
        "isHidden": false
      },
      {
        "input": "2\n4 -2\n2",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "4\n-1 -2 -3 -4\n4",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "3\n5 3 9\n1",
        "expectedOutput": "5 3 9",
        "isHidden": true
      }
    ],
    "hints": [
      "Recomputing the maximum of each window from scratch is O(n*k) — too slow for n up to 100000.",
      "Maintain a deque of indices whose values are in decreasing order from front to back; the front always holds the index of the current window's maximum.",
      "Before adding a new index, pop from the back any indices whose values are less than or equal to the new value (they can never be the max while the new element is in range); also pop from the front any index that has fallen outside the current window."
    ],
    "editorial": "Maintain a deque storing indices of the array such that their corresponding values are in strictly decreasing order from front to back. For each new index i: first pop from the back while the value there is <= arr[i] (those elements can never be the maximum again once arr[i] is in the window), then push i; next, pop from the front if the index there is no longer within the current window (i.e. it's <= i - k). Once i >= k - 1, the value at the front of the deque is the maximum of the current window. Because each index is pushed and popped at most once, the whole algorithm runs in O(n) time, a significant improvement over the O(n*k) brute-force approach."
  },
  {
    "title": "Split Array Largest Sum",
    "slug": "split-array-largest-sum",
    "difficulty": "Hard",
    "topics": [
      "Binary Search",
      "Greedy"
    ],
    "statement": "Given an array of n non-negative integers and an integer m, split the array into m non-empty contiguous subarrays so as to minimize the largest sum among these subarrays. Print that minimized largest sum.",
    "inputFormat": "Line 1: n m\nLine 2: n space-separated non-negative integers",
    "outputFormat": "A single integer: the minimized largest subarray sum",
    "constraints": "1 <= m <= n <= 100000, 0 <= arr[i] <= 10^6",
    "examples": [
      {
        "input": "5 2\n7 2 5 10 8",
        "output": "18",
        "explanation": "Split as [7,2,5] and [10,8], with sums 14 and 18; 18 is the smallest possible largest sum."
      },
      {
        "input": "5 2\n1 2 3 4 5",
        "output": "9",
        "explanation": "Split as [1,2,3] and [4,5], with sums 6 and 9."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\narr = list(map(int, input().split()))\n\n# TODO: binary search on the answer (the largest subarray sum) and use a greedy feasibility check\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: binary search on the answer (the largest subarray sum) and use a greedy feasibility check\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] nm = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int n = nm[0], m = nm[1];\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: binary search on the answer (the largest subarray sum) and use a greedy feasibility check\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: binary search on the answer (the largest subarray sum) and use a greedy feasibility check\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: binary search on the answer (the largest subarray sum) and use a greedy feasibility check\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5 2\n7 2 5 10 8",
        "expectedOutput": "18",
        "isHidden": false
      },
      {
        "input": "5 2\n1 2 3 4 5",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "3 3\n1 4 4",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "4 1\n1 2 3 4",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "4 4\n5 1 9 2",
        "expectedOutput": "9",
        "isHidden": true
      }
    ],
    "hints": [
      "Trying every possible way to split the array is exponential — think about binary searching the answer itself instead.",
      "The minimized largest sum lies somewhere between max(arr) (each element alone can't have a smaller cap) and sum(arr) (one single subarray).",
      "For a candidate cap value, greedily check feasibility: keep adding elements to the current subarray until adding the next one would exceed the cap, then start a new subarray; count how many subarrays this requires and compare to m."
    ],
    "editorial": "Binary search over the answer, the value of the minimized largest sum, in the range [max(arr), sum(arr)]. For a candidate cap, greedily determine the minimum number of subarrays needed so that no subarray's sum exceeds cap: walk through the array accumulating a running sum, and whenever adding the next element would exceed cap, start a new subarray. If the resulting subarray count is <= m, cap is feasible (search smaller values); otherwise it's infeasible (search larger values). This works because feasibility is monotonic in cap. The greedy check is O(n) and the binary search adds O(log(sum(arr))), giving O(n log(sum(arr))) overall — far better than exploring all C(n-1, m-1) ways to split the array."
  },
  {
    "title": "Dijkstra Shortest Path",
    "slug": "dijkstra-shortest-path",
    "difficulty": "Hard",
    "topics": [
      "Graph",
      "Dijkstra",
      "Priority Queue"
    ],
    "statement": "Given a weighted, undirected graph with n nodes (0-indexed) and m edges (each with a positive integer weight), and a source node s and destination node d, print the length of the shortest path from s to d. If d is unreachable from s, print -1.",
    "inputFormat": "Line 1: n m\nNext m lines: u v w (an edge between u and v with weight w)\nLast line: s d",
    "outputFormat": "A single integer: the shortest path distance, or -1 if unreachable",
    "constraints": "1 <= n <= 100000, 0 <= m <= 200000, 1 <= w <= 1000, 0 <= u, v, s, d < n",
    "examples": [
      {
        "input": "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0 4",
        "output": "7",
        "explanation": "Shortest path: 0 -> 2 -> 1 -> 3 -> 4, with cost 1+2+1+3 = 7."
      },
      {
        "input": "3 1\n0 1 5\n0 2",
        "output": "-1",
        "explanation": "Node 2 is not connected to node 0."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\ns, d = map(int, input().split())\n\n# TODO: run Dijkstra's algorithm from s using a min-priority queue to find the shortest distance to d\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\nconst [s, d] = lines[1 + m].trim().split(' ').map(Number);\n\n// TODO: run Dijkstra's algorithm from s using a min-priority queue to find the shortest distance to d\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] nm = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int n = nm[0], m = nm[1];\n        int[][] edges = new int[m][3];\n        for (int i = 0; i < m; i++) edges[i] = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int[] sd = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int s = sd[0], d = sd[1];\n\n        // TODO: run Dijkstra's algorithm from s using a min-priority queue to find the shortest distance to d\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<array<int,3>> edges(m);\n    for (int i = 0; i < m; i++) cin >> edges[i][0] >> edges[i][1] >> edges[i][2];\n    int s, d; cin >> s >> d;\n\n    // TODO: run Dijkstra's algorithm from s using a min-priority queue to find the shortest distance to d\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int eu[200000], ev[200000], ew[200000];\n    for (int i = 0; i < m; i++) scanf(\"%d %d %d\", &eu[i], &ev[i], &ew[i]);\n    int s, d;\n    scanf(\"%d %d\", &s, &d);\n\n    // TODO: run Dijkstra's algorithm from s using a min-priority queue to find the shortest distance to d\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0 4",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "3 1\n0 1 5\n0 2",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "4 4\n0 1 1\n1 2 1\n2 3 1\n0 3 10\n0 3",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "3 2\n0 1 5\n1 2 3\n0 0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "3 3\n0 1 10\n1 2 1\n0 2 5\n0 2",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "hints": [
      "Plain BFS only works for unweighted graphs — here the edges have different positive weights, so you need a different approach.",
      "Use Dijkstra's algorithm: maintain a distance array (initialized to infinity, except 0 for the source) and a min-priority queue of (distance, node) pairs.",
      "Repeatedly pop the closest unvisited node from the priority queue, and relax its edges: if going through it offers a shorter path to a neighbor, update that neighbor's distance and push it into the queue."
    ],
    "editorial": "Build an adjacency list with weights, then run Dijkstra's algorithm from s: initialize dist[s] = 0 and all other distances to infinity, and use a min-priority queue seeded with (0, s). Repeatedly pop the entry with the smallest distance; if it's stale (its distance is greater than the recorded best), skip it, otherwise relax each outgoing edge, pushing a neighbor into the queue whenever a shorter path to it is found. Because all weights are positive, once a node is popped with its final (smallest) distance, that distance is guaranteed optimal. This runs in O((n + m) log n) time using a binary heap, and the answer is dist[d] if finite, else -1."
  },
  {
    "title": "N-Queens Count",
    "slug": "n-queens-count",
    "difficulty": "Hard",
    "topics": [
      "Backtracking"
    ],
    "statement": "Given an integer n, print the number of distinct ways to place n queens on an n x n chessboard so that no two queens attack each other (no two share a row, column, or diagonal).",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: the number of distinct valid placements",
    "constraints": "1 <= n <= 9",
    "examples": [
      {
        "input": "4",
        "output": "2",
        "explanation": "There are exactly 2 distinct solutions for the 4-queens puzzle."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "A single queen on a 1x1 board trivially doesn't attack anything."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print the number of distinct ways to place n non-attacking queens on an n x n board, using backtracking\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print the number of distinct ways to place n non-attacking queens on an n x n board, using backtracking\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the number of distinct ways to place n non-attacking queens on an n x n board, using backtracking\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print the number of distinct ways to place n non-attacking queens on an n x n board, using backtracking\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print the number of distinct ways to place n non-attacking queens on an n x n board, using backtracking\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "8",
        "expectedOutput": "92",
        "isHidden": true
      },
      {
        "input": "2",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "5",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "hints": [
      "Since no two queens can share a row, you can place exactly one queen per row and recurse row by row.",
      "For each row, try placing a queen in every column that isn't already attacked by a previously placed queen (same column, or either diagonal).",
      "Track used columns and the two diagonal directions (row - col and row + col are each constant along a diagonal) with sets to check attacks in O(1), and backtrack after trying each column."
    ],
    "editorial": "Place queens one row at a time via backtracking. For each row, try every column that isn't already blocked: track used columns, and the two diagonal families using row - col (constant along a '\\' diagonal) and row + col (constant along a '/' diagonal) in three sets, so each placement/attack check is O(1). Recurse to the next row after placing a queen, and undo the placement (backtrack) after exploring that branch. When all n rows have a queen placed, count it as one valid solution. This explores far fewer than n^n possibilities thanks to early pruning, and comfortably handles n up to 9."
  },
  {
    "title": "Maximum XOR of Two Numbers in an Array",
    "slug": "maximum-xor-of-two-numbers",
    "difficulty": "Hard",
    "topics": [
      "Bit Manipulation",
      "Trie"
    ],
    "statement": "Given an array of n non-negative integers, print the maximum possible value of arr[i] XOR arr[j] over all pairs of indices i, j (i can equal j is not useful, but any two distinct positions are allowed).",
    "inputFormat": "Line 1: n\nLine 2: n space-separated non-negative integers",
    "outputFormat": "A single integer: the maximum XOR value of any pair",
    "constraints": "2 <= n <= 100000, 0 <= arr[i] <= 2*10^9",
    "examples": [
      {
        "input": "6\n3 10 5 25 2 8",
        "output": "28",
        "explanation": "5 XOR 25 = 28, the maximum over all pairs."
      },
      {
        "input": "2\n0 0",
        "output": "0",
        "explanation": "The only pair has XOR 0."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the maximum XOR of any two elements in arr, building the answer bit by bit from the most significant bit\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the maximum XOR of any two elements in arr, building the answer bit by bit from the most significant bit\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the maximum XOR of any two elements in arr, building the answer bit by bit from the most significant bit\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the maximum XOR of any two elements in arr, building the answer bit by bit from the most significant bit\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the maximum XOR of any two elements in arr, building the answer bit by bit from the most significant bit\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\n3 10 5 25 2 8",
        "expectedOutput": "28",
        "isHidden": false
      },
      {
        "input": "2\n0 0",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "3\n0 1 2",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "5\n1000000000 2000000000 999999999 1 0",
        "expectedOutput": "2000000001",
        "isHidden": true
      }
    ],
    "hints": [
      "Checking every pair directly is O(n^2) — for n up to 100000 that's too slow.",
      "Build the answer bit by bit from the most significant bit down, greedily trying to make each bit of the answer a 1.",
      "At each bit position, keep a set of the prefixes of all numbers up to that bit; a candidate answer bit is achievable if two prefixes in the set XOR to it (equivalently, check if candidate XOR any prefix is also in the set)."
    ],
    "editorial": "Build the maximum XOR value one bit at a time, from the most significant bit (bit 31, since values fit in 32 bits) down to bit 0. Maintain a running best answer; at each bit position, tentatively set that bit in the candidate answer and check whether it's achievable by looking at the set of every number's prefix (the number with all lower bits masked off) up to that bit — if for some prefix p in the set, (candidate XOR p) is also in the set, then two original numbers achieve that candidate, so keep the bit set; otherwise leave it as 0. This greedy bit-by-bit construction (equivalent to using a bitwise trie over the numbers) is optimal because higher bits always dominate lower ones in determining the maximum value, and runs in O(n * 32) time instead of the O(n^2) brute-force comparison of every pair."
  },
  {
    "title": "Count Inversions",
    "slug": "count-inversions",
    "difficulty": "Hard",
    "topics": [
      "Arrays",
      "Divide and Conquer",
      "Sorting"
    ],
    "statement": "Given an array of n integers, print the number of inversions: pairs of indices (i, j) such that i < j and arr[i] > arr[j].",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the number of inversions",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "5\n2 4 1 3 5",
        "output": "3",
        "explanation": "The inverted pairs are (2,1), (4,1), and (4,3)."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0",
        "explanation": "The array is already sorted, so there are no inversions."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the number of inversions in arr, using a merge-sort based divide and conquer approach\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the number of inversions in arr, using a merge-sort based divide and conquer approach\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the number of inversions in arr, using a merge-sort based divide and conquer approach\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the number of inversions in arr, using a merge-sort based divide and conquer approach\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the number of inversions in arr, using a merge-sort based divide and conquer approach\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "5\n2 4 1 3 5",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "1\n42",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "6\n3 1 2 6 4 5",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "Comparing every pair directly is O(n^2), which is too slow for n up to 100000.",
      "Adapt merge sort: while merging two already-sorted halves, you can count inversions between them without extra comparisons.",
      "When merging, if the current element from the right half is smaller than the current element from the left half, it forms an inversion with every remaining element in the left half (since the left half is sorted, they're all bigger too) — add that count directly."
    ],
    "editorial": "Use a merge-sort based divide and conquer approach: recursively sort and count inversions in the left half and the right half, then count cross-inversions while merging the two sorted halves. During the merge step, whenever an element from the right half is placed before an element still remaining in the left half, it is smaller than every remaining element in that (sorted) left half, so it contributes (number of remaining left elements) inversions — add that in bulk instead of counting one at a time. Summing the inversions from the left half, the right half, and the merge step gives the total. This runs in O(n log n) time, a major improvement over the O(n^2) brute-force pairwise comparison needed for n up to 100000."
  },
  {
    "title": "Remove Duplicates from Sorted Array",
    "slug": "remove-duplicates-sorted-array",
    "difficulty": "Easy",
    "topics": [
      "Arrays",
      "Two Pointers"
    ],
    "statement": "Given an array of n integers sorted in non-decreasing order, remove the duplicates in place so that each unique element appears only once, keeping the relative order. Print the number of unique elements, followed by the resulting array containing only the unique elements in order.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers, sorted in non-decreasing order",
    "outputFormat": "Line 1: k, the number of unique elements\nLine 2: k space-separated integers, the unique elements in order",
    "constraints": "1 <= n <= 100000, -1000000000 <= arr[i] <= 1000000000",
    "examples": [
      {
        "input": "7\n1 1 2 2 3 4 4",
        "output": "4\n1 2 3 4",
        "explanation": "The unique values, in order, are 1, 2, 3, 4."
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "5\n1 2 3 4 5",
        "explanation": "All elements are already unique."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the count of unique elements, then the unique elements space separated\ndef solve(arr):\n    pass\n\nresult = solve(arr)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the count of unique elements, then the unique elements space separated\nfunction solve(arr) {\n\n}\n\nsolve(arr);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the count of unique elements, then the unique elements space separated\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the count of unique elements, then the unique elements space separated\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the count of unique elements, then the unique elements space separated\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "7\n1 1 2 2 3 4 4",
        "expectedOutput": "4\n1 2 3 4",
        "isHidden": false
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5\n1 2 3 4 5",
        "isHidden": false
      },
      {
        "input": "1\n7",
        "expectedOutput": "1\n7",
        "isHidden": true
      },
      {
        "input": "4\n2 2 2 2",
        "expectedOutput": "1\n2",
        "isHidden": true
      },
      {
        "input": "6\n-5 -5 -3 0 0 2",
        "expectedOutput": "4\n-5 -3 0 2",
        "isHidden": true
      }
    ],
    "hints": [
      "Since the array is already sorted, every duplicate of a value sits right next to it.",
      "Use two pointers: one scanning the array, one marking the position of the last unique element found so far.",
      "Whenever the scanning pointer finds a value different from the last unique element, it becomes the new unique element."
    ],
    "editorial": "Because the array is sorted, all occurrences of a duplicate value are adjacent, so a single pass with two pointers suffices: maintain a pointer to the end of the unique-elements-so-far region, and for each element in the array, compare it to the last kept unique value — if it differs, append it. This runs in O(n) time and O(1) extra space (beyond the output), a direct improvement over a hash-set based approach that would need O(n) extra space."
  },
  {
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy",
    "topics": [
      "Dynamic Programming",
      "Recursion"
    ],
    "statement": "You are climbing a staircase with n steps. Each time you can climb either 1 or 2 steps. Count the number of distinct ways to reach the top, modulo 1000000007 (since the count can grow very large).",
    "inputFormat": "Line 1: n",
    "outputFormat": "A single integer: the number of distinct ways to reach the top, modulo 1000000007",
    "constraints": "1 <= n <= 1000000",
    "examples": [
      {
        "input": "2",
        "output": "2",
        "explanation": "Ways: (1,1) and (2)."
      },
      {
        "input": "3",
        "output": "3",
        "explanation": "Ways: (1,1,1), (1,2), and (2,1)."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nMOD = 1000000007\n\n# TODO: print the number of distinct ways to climb n stairs (1 or 2 steps at a time), mod 1000000007\ndef solve(n):\n    pass\n\nresult = solve(n)\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\nconst MOD = 1000000007n;\n\n// TODO: print the number of distinct ways to climb n stairs (1 or 2 steps at a time), mod 1000000007\nfunction solve(n) {\n\n}\n\nsolve(n);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        long MOD = 1000000007L;\n\n        // TODO: print the number of distinct ways to climb n stairs (1 or 2 steps at a time), mod 1000000007\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    const long long MOD = 1000000007;\n\n    // TODO: print the number of distinct ways to climb n stairs (1 or 2 steps at a time), mod 1000000007\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long MOD = 1000000007;\n\n    // TODO: print the number of distinct ways to climb n stairs (1 or 2 steps at a time), mod 1000000007\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "10",
        "expectedOutput": "89",
        "isHidden": true
      },
      {
        "input": "1000000",
        "expectedOutput": "534400663",
        "isHidden": true
      }
    ],
    "hints": [
      "The number of ways to reach step n is the sum of the ways to reach step n-1 and step n-2, since those are the only steps you could have jumped from.",
      "This is exactly the Fibonacci recurrence — you don't need recursion with memoization, an O(n) bottom-up loop keeping only the last two values works.",
      "Take the result modulo 1000000007 at every addition step to avoid overflow for large n."
    ],
    "editorial": "The number of ways to reach step n equals ways(n-1) + ways(n-2), because the last move to reach step n was either a single step from n-1 or a double step from n-2. With base cases ways(1)=1 and ways(2)=2, this is the Fibonacci sequence shifted by one. Compute it iteratively in O(n) time and O(1) space by keeping only the last two values and taking the result modulo 1000000007 at each step, which avoids both the exponential blow-up of naive recursion and integer overflow."
  },
  {
    "title": "Roman to Integer",
    "slug": "roman-to-integer",
    "difficulty": "Easy",
    "topics": [
      "Strings",
      "Hash Map"
    ],
    "statement": "Roman numerals are represented by the symbols I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Numbers are normally written largest to smallest, but a smaller value placed immediately before a larger one is subtracted (e.g. IV=4, IX=9, XL=40, XC=90, CD=400, CM=900). Given a valid Roman numeral string, convert it to its integer value.",
    "inputFormat": "Line 1: a valid Roman numeral string (uppercase letters from I, V, X, L, C, D, M)",
    "outputFormat": "A single integer: the value of the Roman numeral",
    "constraints": "1 <= length <= 15, the value represented is between 1 and 3999",
    "examples": [
      {
        "input": "III",
        "output": "3",
        "explanation": "I + I + I = 1 + 1 + 1 = 3."
      },
      {
        "input": "LVIII",
        "output": "58",
        "explanation": "L + V + III = 50 + 5 + 3 = 58."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the integer value of the Roman numeral s\ndef solve(s):\n    pass\n\nresult = solve(s)\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the integer value of the Roman numeral s\nfunction solve(s) {\n\n}\n\nsolve(s);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the integer value of the Roman numeral s\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the integer value of the Roman numeral s\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[16];\n    scanf(\"%s\", s);\n\n    // TODO: print the integer value of the Roman numeral s\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "III",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "LVIII",
        "expectedOutput": "58",
        "isHidden": false
      },
      {
        "input": "MCMXCIV",
        "expectedOutput": "1994",
        "isHidden": true
      },
      {
        "input": "IX",
        "expectedOutput": "9",
        "isHidden": true
      },
      {
        "input": "MMMCMXCIX",
        "expectedOutput": "3999",
        "isHidden": true
      }
    ],
    "hints": [
      "Map each symbol to its value, then scan the string and add up values greedily.",
      "The trick is subtraction: if a symbol's value is smaller than the value of the symbol immediately after it, it should be subtracted instead of added.",
      "Compare each character's value to the next character's value: if next is strictly greater, subtract the current value, otherwise add it."
    ],
    "editorial": "Map each Roman symbol to its integer value, then scan the string left to right. For each character, compare its value to the value of the next character (if any): if the current value is smaller than the next one, it represents a subtractive pair (like IV or IX), so subtract it from the running total; otherwise add it. This single O(n) pass correctly handles both normal and subtractive notation without needing to explicitly detect two-character combinations."
  },
  {
    "title": "Majority Element",
    "slug": "majority-element",
    "difficulty": "Easy",
    "topics": [
      "Arrays"
    ],
    "statement": "Given an array of n integers, find the majority element — the element that appears more than n/2 times. It is guaranteed that a majority element always exists in the array.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the majority element",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "7\n2 2 1 1 1 2 2",
        "output": "2",
        "explanation": "2 appears 4 times out of 7, more than 3.5."
      },
      {
        "input": "3\n1 1 2",
        "output": "1",
        "explanation": "1 appears 2 times out of 3, more than 1.5."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the majority element (appears more than n/2 times)\ndef solve(arr):\n    pass\n\nresult = solve(arr)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the majority element (appears more than n/2 times)\nfunction solve(arr) {\n\n}\n\nsolve(arr);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the majority element (appears more than n/2 times)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the majority element (appears more than n/2 times)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    // TODO: print the majority element (appears more than n/2 times)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "7\n2 2 1 1 1 2 2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3\n1 1 2",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "1\n5",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "5\n3 3 3 1 2",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "9\n7 7 7 7 7 1 2 3 4",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "hints": [
      "A hash map counting occurrences works but uses O(n) extra space — can you do it in O(1) space?",
      "Think of it as a voting process: keep a running candidate and a count; when count hits 0, switch the candidate.",
      "This is the Boyer-Moore voting algorithm: increment the count when you see the candidate, decrement otherwise; since the majority element appears more than n/2 times, it always survives as the final candidate."
    ],
    "editorial": "Use the Boyer-Moore voting algorithm: maintain a candidate and a counter, initialized to the first element and 0. For each element, if the counter is 0, set the candidate to the current element; then increment the counter if the current element equals the candidate, or decrement it otherwise. Because the majority element occurs more than n/2 times, it cannot be fully cancelled out by all other elements combined, so it is guaranteed to be the candidate at the end. This runs in O(n) time and O(1) extra space, better than a hash-map frequency count which needs O(n) space."
  },
  {
    "title": "Integer Square Root",
    "slug": "integer-square-root",
    "difficulty": "Easy",
    "topics": [
      "Binary Search",
      "Math"
    ],
    "statement": "Given a non-negative integer x, compute floor(sqrt(x)) — the largest integer whose square is less than or equal to x. Do not use a built-in square root function; find it using binary search.",
    "inputFormat": "Line 1: x",
    "outputFormat": "A single integer: floor(sqrt(x))",
    "constraints": "0 <= x <= 2147483647",
    "examples": [
      {
        "input": "8",
        "output": "2",
        "explanation": "2*2=4 <= 8, but 3*3=9 > 8."
      },
      {
        "input": "16",
        "output": "4",
        "explanation": "4*4=16 <= 16, and 4 is the largest such integer."
      }
    ],
    "starterCode": {
      "python": "x = int(input())\n\n# TODO: print floor(sqrt(x)) using binary search, without a built-in sqrt function\ndef solve(x):\n    pass\n\nresult = solve(x)\n",
      "javascript": "const x = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print floor(sqrt(x)) using binary search, without a built-in sqrt function\nfunction solve(x) {\n\n}\n\nsolve(x);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long x = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print floor(sqrt(x)) using binary search, without a built-in sqrt function\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long x; cin >> x;\n\n    // TODO: print floor(sqrt(x)) using binary search, without a built-in sqrt function\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long x;\n    scanf(\"%lld\", &x);\n\n    // TODO: print floor(sqrt(x)) using binary search, without a built-in sqrt function\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "8",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "16",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1000000000",
        "expectedOutput": "31622",
        "isHidden": true
      },
      {
        "input": "2147483647",
        "expectedOutput": "46340",
        "isHidden": true
      }
    ],
    "hints": [
      "The answer lies somewhere between 0 and x, and mid*mid <= x is a monotonic condition, which is a strong hint for binary search.",
      "Binary search on the answer: for a candidate mid, check if mid*mid <= x.",
      "Keep track of the largest mid whose square doesn't exceed x, narrowing the search range each time; watch for overflow when squaring large values."
    ],
    "editorial": "Binary search directly on the answer in the range [0, x]. For a candidate mid, if mid*mid <= x, it's a valid candidate for the floor square root, so record it and search the upper half for a possibly larger valid value; otherwise search the lower half. This runs in O(log x) time. Use a 64-bit type when squaring mid to avoid overflow, since x can be as large as 2^31-1."
  },
  {
    "title": "String Run-Length Encoding",
    "slug": "string-run-length-encoding",
    "difficulty": "Easy",
    "topics": [
      "Strings"
    ],
    "statement": "Given a string s consisting of letters, perform run-length encoding: replace every maximal run of consecutive identical characters with the character followed by the length of that run (even if the run has length 1).",
    "inputFormat": "Line 1: s (a string of letters)",
    "outputFormat": "The run-length encoded string",
    "constraints": "1 <= length of s <= 1000",
    "examples": [
      {
        "input": "aaabbc",
        "output": "a3b2c1",
        "explanation": "Runs: aaa (3), bb (2), c (1)."
      },
      {
        "input": "abcd",
        "output": "a1b1c1d1",
        "explanation": "Every run has length 1."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the run-length encoding of s (character followed by run length, for every run)\ndef solve(s):\n    pass\n\nresult = solve(s)\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the run-length encoding of s (character followed by run length, for every run)\nfunction solve(s) {\n\n}\n\nsolve(s);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the run-length encoding of s (character followed by run length, for every run)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the run-length encoding of s (character followed by run length, for every run)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001];\n    scanf(\"%s\", s);\n\n    // TODO: print the run-length encoding of s (character followed by run length, for every run)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "aaabbc",
        "expectedOutput": "a3b2c1",
        "isHidden": false
      },
      {
        "input": "abcd",
        "expectedOutput": "a1b1c1d1",
        "isHidden": false
      },
      {
        "input": "aaaa",
        "expectedOutput": "a4",
        "isHidden": true
      },
      {
        "input": "a",
        "expectedOutput": "a1",
        "isHidden": true
      },
      {
        "input": "aabbaa",
        "expectedOutput": "a2b2a2",
        "isHidden": true
      }
    ],
    "hints": [
      "Walk through the string once, keeping track of the current character and how many times it has repeated in a row.",
      "When the next character differs from the current run's character, output the run and start a new one.",
      "Don't forget to flush the final run after the loop ends."
    ],
    "editorial": "Iterate through the string with a pointer, and for each position find the extent of the maximal run of identical characters by advancing a second pointer while the character matches. Append the character and the run length to the result, then continue from the end of that run. This is a single O(n) pass through the string."
  },
  {
    "title": "Isomorphic Strings",
    "slug": "isomorphic-strings",
    "difficulty": "Easy",
    "topics": [
      "Strings",
      "Hash Map"
    ],
    "statement": "Given two strings s and t of equal length, determine whether they are isomorphic. Two strings are isomorphic if the characters in s can be replaced to get t, such that there is a consistent one-to-one mapping between every character in s and every character in t (no character maps to two different characters, and no two characters map to the same character). Print \"true\" or \"false\".",
    "inputFormat": "Line 1: s\nLine 2: t (same length as s)",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= length <= 1000, length of s equals length of t",
    "examples": [
      {
        "input": "egg\nadd",
        "output": "true",
        "explanation": "e->a, g->d is a consistent one-to-one mapping."
      },
      {
        "input": "foo\nbar",
        "output": "false",
        "explanation": "o would need to map to both a and r."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\nt = input().strip()\n\n# TODO: print \"true\" if s and t are isomorphic, else \"false\"\ndef solve(s, t):\n    pass\n\nresult = solve(s, t)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst s = lines[0].trim();\nconst t = lines[1].trim();\n\n// TODO: print \"true\" if s and t are isomorphic, else \"false\"\nfunction solve(s, t) {\n\n}\n\nsolve(s, t);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        String t = sc.nextLine().trim();\n\n        // TODO: print \"true\" if s and t are isomorphic, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s, t;\n    cin >> s >> t;\n\n    // TODO: print \"true\" if s and t are isomorphic, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001], t[1001];\n    scanf(\"%s %s\", s, t);\n\n    // TODO: print \"true\" if s and t are isomorphic, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "egg\nadd",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "foo\nbar",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "ab\naa",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "a\na",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "paper\ntitle",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "You need the mapping to be consistent in both directions: from s to t, and from t to s.",
      "Use two hash maps: one mapping characters of s to characters of t, and one mapping characters of t back to characters of s.",
      "At each position, check both maps for a conflict before adding a new mapping."
    ],
    "editorial": "Maintain two hash maps, one for the forward mapping (s character to t character) and one for the reverse mapping (t character to s character). Scan both strings together; at each position, if the forward map already has an entry for s's character that disagrees with t's character, or the reverse map already has an entry for t's character that disagrees with s's character, the strings are not isomorphic. Otherwise record both mappings and continue. Checking both directions is essential — checking only one direction would incorrectly accept cases like s=\"ab\", t=\"aa\" where two different source characters map to the same target character. This runs in O(n) time."
  },
  {
    "title": "Power of Three",
    "slug": "power-of-three",
    "difficulty": "Easy",
    "topics": [
      "Math",
      "Recursion"
    ],
    "statement": "Given an integer n, determine whether it is a power of three, i.e. whether there exists a non-negative integer k such that n = 3^k. Print \"true\" or \"false\".",
    "inputFormat": "Line 1: n",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "-2147483648 <= n <= 2147483647",
    "examples": [
      {
        "input": "27",
        "output": "true",
        "explanation": "27 = 3^3."
      },
      {
        "input": "0",
        "output": "false",
        "explanation": "0 is not 3 raised to any non-negative integer power."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print \"true\" if n is a power of three, else \"false\"\ndef solve(n):\n    pass\n\nresult = solve(n)\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print \"true\" if n is a power of three, else \"false\"\nfunction solve(n) {\n\n}\n\nsolve(n);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = Long.parseLong(sc.nextLine().trim());\n\n        // TODO: print \"true\" if n is a power of three, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n; cin >> n;\n\n    // TODO: print \"true\" if n is a power of three, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long n;\n    scanf(\"%lld\", &n);\n\n    // TODO: print \"true\" if n is a power of three, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "27",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "0",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "45",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "-9",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "hints": [
      "Non-positive numbers (other than checking 1=3^0) can never be a power of three.",
      "Repeatedly divide n by 3 as long as it divides evenly; if you end up at exactly 1, it was a power of three.",
      "Watch the edge case n=1 (which is 3^0, so it should be true) and n<=0 (never a power of three)."
    ],
    "editorial": "If n is less than 1, it can never be a power of three, so return false immediately. Otherwise, repeatedly divide n by 3 as long as it is divisible by 3; if the process ends with n equal to 1, the original value was exactly 3^k for some k, so return true, otherwise return false. This runs in O(log_3 n) time. An alternative O(1) trick exists (checking divisibility against the largest power of three that fits in a 32-bit integer), but the iterative division is simple and efficient enough."
  },
  {
    "title": "Linked List Cycle Detection",
    "slug": "linked-list-cycle-detection",
    "difficulty": "Easy",
    "topics": [
      "Linked List"
    ],
    "statement": "A singly linked list has n nodes labeled 0 to n-1. It is given as an array next, where next[i] is the index of the node that node i points to, or -1 if node i is the last node. Given the head node's index, determine whether the linked list contains a cycle. Print \"true\" if it does, otherwise \"false\".",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers, next[0..n-1] (each is a node index or -1)\nLine 3: head (the index of the head node)",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= n <= 100000, -1 <= next[i] < n, 0 <= head < n",
    "examples": [
      {
        "input": "4\n1 2 3 -1\n0",
        "output": "false",
        "explanation": "Following next pointers from node 0: 0 -> 1 -> 2 -> 3 -> end, no cycle."
      },
      {
        "input": "4\n1 2 3 1\n0",
        "output": "true",
        "explanation": "Node 3 points back to node 1, forming a cycle 1 -> 2 -> 3 -> 1."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nnxt = list(map(int, input().split()))\nhead = int(input())\n\n# TODO: print \"true\" if the linked list (given by next-pointers) has a cycle, else \"false\"\ndef solve(n, nxt, head):\n    pass\n\nresult = solve(n, nxt, head)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst nxt = lines[1].trim().split(' ').map(Number);\nconst head = parseInt(lines[2]);\n\n// TODO: print \"true\" if the linked list (given by next-pointers) has a cycle, else \"false\"\nfunction solve(n, nxt, head) {\n\n}\n\nsolve(n, nxt, head);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] nxt = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int head = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print \"true\" if the linked list (given by next-pointers) has a cycle, else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nxt(n);\n    for (int i = 0; i < n; i++) cin >> nxt[i];\n    int head; cin >> head;\n\n    // TODO: print \"true\" if the linked list (given by next-pointers) has a cycle, else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int nxt[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &nxt[i]);\n    int head;\n    scanf(\"%d\", &head);\n\n    // TODO: print \"true\" if the linked list (given by next-pointers) has a cycle, else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 2 3 -1\n0",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "4\n1 2 3 1\n0",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "1\n-1\n0",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "2\n1 0\n0",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "1\n0\n0",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "A visited-set approach works: follow next pointers and stop if you revisit a node or reach -1.",
      "For O(1) extra space, use Floyd's cycle detection: a slow pointer moving one step at a time and a fast pointer moving two steps at a time.",
      "If there is a cycle, the fast pointer will eventually lap the slow pointer and they will meet at the same node; if the fast pointer reaches -1 first, there is no cycle."
    ],
    "editorial": "Use Floyd's cycle detection (the tortoise and hare technique): start two pointers at head, advance the slow pointer by one node and the fast pointer by two nodes at each step, stopping if the fast pointer (or its immediate next) reaches -1, which means the list ends and there is no cycle. If the fast pointer ever equals the slow pointer, a cycle exists. Because the fast pointer gains one extra step on the slow pointer each iteration, if a cycle exists they are guaranteed to meet within one full loop of the cycle. This runs in O(n) time and O(1) extra space, better than a hash-set based visited check which needs O(n) space."
  },
  {
    "title": "Height of a Binary Tree",
    "slug": "binary-tree-height",
    "difficulty": "Easy",
    "topics": [
      "Trees",
      "Recursion"
    ],
    "statement": "A binary tree has n nodes labeled 0 to n-1. For each node you are given its left child index and right child index, each either a valid node index or -1 if that child does not exist. Given the index of the root, compute the height of the tree, defined as the number of nodes on the longest path from the root to a leaf (a tree with a single node has height 1).",
    "inputFormat": "Line 1: n\nNext n lines: for node i (i from 0 to n-1), two space-separated integers left[i] right[i]\nLast line: root (the index of the root node)",
    "outputFormat": "A single integer: the height of the tree",
    "constraints": "1 <= n <= 100000",
    "examples": [
      {
        "input": "3\n1 2\n-1 -1\n-1 -1\n0",
        "output": "2",
        "explanation": "Root 0 has two leaf children, 1 and 2, so the longest path has 2 nodes."
      },
      {
        "input": "1\n-1 -1\n0",
        "output": "1",
        "explanation": "A single node has height 1."
      }
    ],
    "starterCode": {
      "python": "import sys\ninput_data = sys.stdin.read().split('\\n')\nidx = 0\nn = int(input_data[idx]); idx += 1\nleft = [0] * n\nright = [0] * n\nfor i in range(n):\n    l, r = map(int, input_data[idx].split()); idx += 1\n    left[i] = l\n    right[i] = r\nroot = int(input_data[idx]); idx += 1\n\n# TODO: print the height of the binary tree (number of nodes on the longest root-to-leaf path)\ndef solve(n, left, right, root):\n    pass\n\nresult = solve(n, left, right, root)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nlet idx = 0;\nconst n = parseInt(lines[idx++]);\nconst left = new Array(n);\nconst right = new Array(n);\nfor (let i = 0; i < n; i++) {\n  const [l, r] = lines[idx++].trim().split(' ').map(Number);\n  left[i] = l;\n  right[i] = r;\n}\nconst root = parseInt(lines[idx++]);\n\n// TODO: print the height of the binary tree (number of nodes on the longest root-to-leaf path)\nfunction solve(n, left, right, root) {\n\n}\n\nsolve(n, left, right, root);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] left = new int[n];\n        int[] right = new int[n];\n        for (int i = 0; i < n; i++) {\n            String[] parts = sc.nextLine().trim().split(\" \");\n            left[i] = Integer.parseInt(parts[0]);\n            right[i] = Integer.parseInt(parts[1]);\n        }\n        int root = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the height of the binary tree (number of nodes on the longest root-to-leaf path)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> left(n), right(n);\n    for (int i = 0; i < n; i++) cin >> left[i] >> right[i];\n    int root; cin >> root;\n\n    // TODO: print the height of the binary tree (number of nodes on the longest root-to-leaf path)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int left[100000], right[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &left[i], &right[i]);\n    int root;\n    scanf(\"%d\", &root);\n\n    // TODO: print the height of the binary tree (number of nodes on the longest root-to-leaf path)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n1 2\n-1 -1\n-1 -1\n0",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "1\n-1 -1\n0",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "4\n1 -1\n2 -1\n3 -1\n-1 -1\n0",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "2\n1 -1\n-1 -1\n0",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "5\n1 2\n-1 3\n-1 -1\n4 -1\n-1 -1\n0",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "The height of a tree rooted at a node is 1 plus the taller of its two subtrees' heights.",
      "A node with index -1 represents an empty subtree, which has height 0.",
      "Write a recursive function: height(-1) = 0, and height(node) = 1 + max(height(left[node]), height(right[node]))."
    ],
    "editorial": "Compute the height recursively: an empty subtree (index -1) has height 0, and any other node's height is 1 plus the maximum of its left and right subtree heights. This is a straightforward post-order DFS that visits each node exactly once, running in O(n) time and O(h) recursion stack space, where h is the height of the tree."
  },
  {
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Sorting"
    ],
    "statement": "Given n intervals, each with a start and end, merge all overlapping intervals into the smallest possible set of non-overlapping intervals that covers exactly the same points. Two intervals overlap if they share at least one point (touching at an endpoint counts as overlapping, e.g. [1,4] and [4,5] merge into [1,5]). Print the merged intervals sorted by start value.",
    "inputFormat": "Line 1: n\nNext n lines: start end",
    "outputFormat": "Line 1: k, the number of merged intervals\nNext k lines: start end, sorted by start",
    "constraints": "1 <= n <= 100000, all start and end values fit in a 32-bit integer, start <= end for every interval",
    "examples": [
      {
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "output": "3\n1 6\n8 10\n15 18",
        "explanation": "[1,3] and [2,6] overlap and merge into [1,6]; the rest stand alone."
      },
      {
        "input": "2\n1 4\n4 5",
        "output": "1\n1 5",
        "explanation": "[1,4] and [4,5] touch at 4, so they merge into [1,5]."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# TODO: print the merged non-overlapping intervals, sorted by start\ndef solve(intervals):\n    pass\n\nresult = solve(intervals)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst intervals = [];\nfor (let i = 0; i < n; i++) intervals.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the merged non-overlapping intervals, sorted by start\nfunction solve(intervals) {\n\n}\n\nsolve(intervals);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[][] intervals = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            String[] parts = sc.nextLine().trim().split(\" \");\n            intervals[i][0] = Integer.parseInt(parts[0]);\n            intervals[i][1] = Integer.parseInt(parts[1]);\n        }\n\n        // TODO: print the merged non-overlapping intervals, sorted by start\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<pair<int,int>> intervals(n);\n    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;\n\n    // TODO: print the merged non-overlapping intervals, sorted by start\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int start[100000], end_[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &start[i], &end_[i]);\n\n    // TODO: print the merged non-overlapping intervals, sorted by start\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "expectedOutput": "3\n1 6\n8 10\n15 18",
        "isHidden": false
      },
      {
        "input": "2\n1 4\n4 5",
        "expectedOutput": "1\n1 5",
        "isHidden": false
      },
      {
        "input": "1\n1 1",
        "expectedOutput": "1\n1 1",
        "isHidden": true
      },
      {
        "input": "3\n1 4\n0 4\n3 5",
        "expectedOutput": "1\n0 5",
        "isHidden": true
      },
      {
        "input": "3\n1 2\n5 6\n10 11",
        "expectedOutput": "3\n1 2\n5 6\n10 11",
        "isHidden": true
      }
    ],
    "hints": [
      "Sort the intervals by start value first — merging is only easy once they're in order.",
      "Walk through the sorted intervals, keeping a running merged interval; if the next interval's start is within (or touching) the current merged interval's end, extend it.",
      "If the next interval starts strictly after the current merged interval's end, the current merged interval is finished — output it and start a new one."
    ],
    "editorial": "Sort the intervals by their start value, then sweep through them while maintaining a current merged interval. For each interval in sorted order, if its start is less than or equal to the current merged interval's end, they overlap (or touch), so extend the current merged interval's end to the maximum of the two ends; otherwise the current merged interval is complete, so record it and start a new one with the current interval. Finally record the last merged interval. Sorting takes O(n log n) and the sweep takes O(n), so overall this runs in O(n log n) time."
  },
  {
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium",
    "topics": [
      "Binary Search",
      "Arrays"
    ],
    "statement": "An array of n distinct integers was originally sorted in ascending order, then rotated at some unknown pivot. Given the rotated array and a target value, find the 0-indexed position of the target in the array using an O(log n) algorithm. If the target is not present, print -1.",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers (the rotated array)\nLine 3: target",
    "outputFormat": "A single integer: the index of target, or -1 if not present",
    "constraints": "1 <= n <= 100000, all elements are distinct",
    "examples": [
      {
        "input": "7\n4 5 6 7 0 1 2\n0",
        "output": "4",
        "explanation": "0 is located at index 4."
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n3",
        "output": "-1",
        "explanation": "3 does not appear in the array."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: print the index of target in the rotated sorted array using O(log n) binary search, or -1\ndef solve(arr, target):\n    pass\n\nresult = solve(arr, target)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\n// TODO: print the index of target in the rotated sorted array using O(log n) binary search, or -1\nfunction solve(arr, target) {\n\n}\n\nsolve(arr, target);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print the index of target in the rotated sorted array using O(log n) binary search, or -1\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n\n    // TODO: print the index of target in the rotated sorted array using O(log n) binary search, or -1\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    int target;\n    scanf(\"%d\", &target);\n\n    // TODO: print the index of target in the rotated sorted array using O(log n) binary search, or -1\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "7\n4 5 6 7 0 1 2\n0",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1\n1\n0",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "5\n3 4 5 1 2\n1",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "hints": [
      "A plain binary search doesn't directly work since the array isn't fully sorted, but at least one half of any subrange is always sorted.",
      "At each step, determine which half (left of mid, or right of mid) is sorted by comparing arr[lo] with arr[mid].",
      "Once you know which half is sorted, check if the target lies within that sorted half's range; if it does, search there, otherwise search the other half."
    ],
    "editorial": "Use a modified binary search. At each step, look at the middle element: if arr[lo] <= arr[mid], the left half [lo, mid] is sorted, so check whether the target lies within that range — if so, search the left half, otherwise search the right half. Symmetrically, if the right half [mid, hi] is sorted, check whether the target lies within its range and recurse accordingly. Because one of the two halves is always sorted, this decision can always be made in O(1) at each step, giving an overall O(log n) algorithm despite the array not being fully sorted."
  },
  {
    "title": "Generate Parentheses",
    "slug": "generate-parentheses",
    "difficulty": "Medium",
    "topics": [
      "Backtracking",
      "Strings"
    ],
    "statement": "Given n, generate all combinations of n pairs of well-formed (balanced) parentheses. Print each combination on its own line, in the order produced by trying to place '(' before ')' at every step (this order is also the ascending lexicographic order, since '(' sorts before ')').",
    "inputFormat": "Line 1: n",
    "outputFormat": "Each valid combination of n pairs of balanced parentheses, one per line",
    "constraints": "1 <= n <= 8",
    "examples": [
      {
        "input": "1",
        "output": "()",
        "explanation": "Only one combination is possible for a single pair."
      },
      {
        "input": "2",
        "output": "(())\n()()",
        "explanation": "The two valid combinations for 2 pairs, generated by trying '(' before ')' at each step."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\n\n# TODO: print every combination of n pairs of balanced parentheses, one per line, trying '(' before ')'\ndef solve(n):\n    pass\n\nresult = solve(n)\n",
      "javascript": "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\n\n// TODO: print every combination of n pairs of balanced parentheses, one per line, trying '(' before ')'\nfunction solve(n) {\n\n}\n\nsolve(n);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // TODO: print every combination of n pairs of balanced parentheses, one per line, trying '(' before ')'\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n\n    // TODO: print every combination of n pairs of balanced parentheses, one per line, trying '(' before ')'\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nchar buf[20];\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n\n    // TODO: print every combination of n pairs of balanced parentheses, one per line, trying '(' before ')'\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "()",
        "isHidden": false
      },
      {
        "input": "2",
        "expectedOutput": "(())\n()()",
        "isHidden": false
      },
      {
        "input": "3",
        "expectedOutput": "((()))\n(()())\n(())()\n()(())\n()()()",
        "isHidden": true
      },
      {
        "input": "4",
        "expectedOutput": "(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()",
        "isHidden": true
      },
      {
        "input": "5",
        "expectedOutput": "((((()))))\n(((()())))\n(((())()))\n(((()))())\n(((())))()\n((()(())))\n((()()()))\n((()())())\n((()()))()\n((())(()))\n((())()())\n((())())()\n((()))(())\n((()))()()\n(()((())))\n(()(()()))\n(()(())())\n(()(()))()\n(()()(()))\n(()()()())\n(()()())()\n(()())(())\n(()())()()\n(())((()))\n(())(()())\n(())(())()\n(())()(())\n(())()()()\n()(((())))\n()((()()))\n()((())())\n()((()))()\n()(()(()))\n()(()()())\n()(()())()\n()(())(())\n()(())()()\n()()((()))\n()()(()())\n()()(())()\n()()()(())\n()()()()()",
        "isHidden": true
      }
    ],
    "hints": [
      "Build the string one character at a time using backtracking, tracking how many '(' and ')' have been placed so far.",
      "You may place '(' as long as you've used fewer than n of them; you may place ')' only if it wouldn't create more closing than opening brackets so far.",
      "Always try placing '(' before ')' at each recursive step to naturally produce output in lexicographic order."
    ],
    "editorial": "Use backtracking: build the string character by character, tracking the count of '(' and ')' placed so far. At each step, you may add '(' if fewer than n have been used, and you may add ')' only if fewer ')' than '(' have been used so far (to never create an invalid prefix). When the string reaches length 2n, it is a complete valid combination. Trying '(' before ')' at each branch produces the combinations in lexicographic order for free, since '(' has a smaller ASCII value than ')'. The number of valid combinations is the nth Catalan number, so this runs in time proportional to the Catalan number, which is why n is capped at a small value."
  },
  {
    "title": "Longest Palindromic Substring",
    "slug": "longest-palindromic-substring",
    "difficulty": "Medium",
    "topics": [
      "Strings",
      "Two Pointers"
    ],
    "statement": "Given a string s, find the longest substring of s that is a palindrome. If more than one substring achieves the maximum length, print the one that starts at the smallest index.",
    "inputFormat": "Line 1: s (a string of lowercase letters)",
    "outputFormat": "The longest palindromic substring of s",
    "constraints": "1 <= length of s <= 2000",
    "examples": [
      {
        "input": "babad",
        "output": "bab",
        "explanation": "\"bab\" and \"aba\" are both length-3 palindromes; \"bab\" starts first, at index 0."
      },
      {
        "input": "cbbd",
        "output": "bb",
        "explanation": "\"bb\" is the longest palindromic substring."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\n\n# TODO: print the longest palindromic substring of s (earliest start index wins ties)\ndef solve(s):\n    pass\n\nresult = solve(s)\n",
      "javascript": "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\n\n// TODO: print the longest palindromic substring of s (earliest start index wins ties)\nfunction solve(s) {\n\n}\n\nsolve(s);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // TODO: print the longest palindromic substring of s (earliest start index wins ties)\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // TODO: print the longest palindromic substring of s (earliest start index wins ties)\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[2001];\n    scanf(\"%s\", s);\n\n    // TODO: print the longest palindromic substring of s (earliest start index wins ties)\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "babad",
        "expectedOutput": "bab",
        "isHidden": false
      },
      {
        "input": "cbbd",
        "expectedOutput": "bb",
        "isHidden": false
      },
      {
        "input": "a",
        "expectedOutput": "a",
        "isHidden": true
      },
      {
        "input": "ac",
        "expectedOutput": "a",
        "isHidden": true
      },
      {
        "input": "aaaa",
        "expectedOutput": "aaaa",
        "isHidden": true
      }
    ],
    "hints": [
      "A palindrome can be found by expanding outward from its center; every palindrome has either one center (odd length) or two centers (even length).",
      "For every index i, try expanding around center i (odd-length palindromes) and around the gap between i and i+1 (even-length palindromes).",
      "Track the best (start, length) found across all centers, only updating when you find a strictly longer palindrome so the earliest one wins ties."
    ],
    "editorial": "Use the expand-around-center technique: for every possible center (there are 2n-1 of them — n single-character centers for odd-length palindromes and n-1 gaps for even-length ones), expand outward while the characters on both sides match, and track the longest palindrome found. Only update the best answer when a strictly longer palindrome is found, which naturally keeps the earliest-starting one on ties. This runs in O(n^2) time in the worst case (each expansion is O(n)), which is efficient enough for n up to 2000; it avoids the need for the more complex O(n) Manacher's algorithm."
  },
  {
    "title": "Maximum Product Subarray",
    "slug": "maximum-product-subarray",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Dynamic Programming"
    ],
    "statement": "Given an array of n integers (which may include negative numbers and zero), find the maximum product achievable by any contiguous subarray (a subarray must contain at least one element).",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers",
    "outputFormat": "A single integer: the maximum product of a contiguous subarray",
    "constraints": "1 <= n <= 1000, -20 <= arr[i] <= 20, the answer is guaranteed to fit in a signed 64-bit integer",
    "examples": [
      {
        "input": "4\n2 3 -2 4",
        "output": "6",
        "explanation": "The subarray [2,3] has product 6, the maximum possible."
      },
      {
        "input": "3\n-2 0 -1",
        "output": "0",
        "explanation": "Any subarray spanning both negatives also includes the 0, giving product 0; the best is the single element 0."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: print the maximum product of a contiguous subarray\ndef solve(arr):\n    pass\n\nresult = solve(arr)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the maximum product of a contiguous subarray\nfunction solve(arr) {\n\n}\n\nsolve(arr);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        long[] arr = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToLong(Long::parseLong).toArray();\n\n        // TODO: print the maximum product of a contiguous subarray\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    // TODO: print the maximum product of a contiguous subarray\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long arr[1000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &arr[i]);\n\n    // TODO: print the maximum product of a contiguous subarray\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4\n2 3 -2 4",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "3\n-2 0 -1",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "3\n-2 3 -4",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "1\n-5",
        "expectedOutput": "-5",
        "isHidden": true
      },
      {
        "input": "6\n2 -5 -2 -4 3 0",
        "expectedOutput": "24",
        "isHidden": true
      }
    ],
    "hints": [
      "Kadane's algorithm for maximum sum doesn't directly work here, because a large negative product can become the maximum if multiplied by another negative.",
      "At each position, track both the maximum and minimum product ending at that position — a new minimum can become the new maximum after multiplying by a negative number.",
      "At each step, the new maximum ending here is the largest of: the current element alone, current element times previous max, or current element times previous min."
    ],
    "editorial": "Track two running values as you scan the array: maxProd and minProd, the maximum and minimum products of a subarray ending at the current position. At each element x, compute the three candidates x, maxProd*x, and minProd*x; the new maxProd is the largest of these and the new minProd is the smallest — tracking the minimum is essential because multiplying a very negative product by a negative x can produce the new maximum. The overall answer is the largest maxProd seen across all positions. This runs in O(n) time and O(1) extra space, a direct adaptation of Kadane's algorithm for products instead of sums."
  },
  {
    "title": "Group Anagrams Count",
    "slug": "group-anagrams-count",
    "difficulty": "Medium",
    "topics": [
      "Strings",
      "Hash Map",
      "Sorting"
    ],
    "statement": "Given n lowercase strings, group them so that strings in the same group are anagrams of each other (contain exactly the same letters with the same multiplicities, in any order). Print the number of groups formed, followed by the size of each group in non-increasing order.",
    "inputFormat": "Line 1: n\nNext n lines: a lowercase string",
    "outputFormat": "Line 1: k, the number of anagram groups\nLine 2: k space-separated integers, the group sizes in non-increasing order",
    "constraints": "1 <= n <= 100000, 1 <= length of each string <= 100",
    "examples": [
      {
        "input": "6\neat\ntea\ntan\nate\nnat\nbat",
        "output": "3\n3 2 1",
        "explanation": "Groups: {eat,tea,ate} size 3, {tan,nat} size 2, {bat} size 1."
      },
      {
        "input": "1\na",
        "output": "1\n1",
        "explanation": "A single string forms its own group of size 1."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nwords = [input().strip() for _ in range(n)]\n\n# TODO: print the number of anagram groups, then the group sizes sorted in non-increasing order\ndef solve(words):\n    pass\n\nresult = solve(words)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst words = [];\nfor (let i = 0; i < n; i++) words.push(lines[1 + i].trim());\n\n// TODO: print the number of anagram groups, then the group sizes sorted in non-increasing order\nfunction solve(words) {\n\n}\n\nsolve(words);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        String[] words = new String[n];\n        for (int i = 0; i < n; i++) words[i] = sc.nextLine().trim();\n\n        // TODO: print the number of anagram groups, then the group sizes sorted in non-increasing order\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<string> words(n);\n    for (int i = 0; i < n; i++) cin >> words[i];\n\n    // TODO: print the number of anagram groups, then the group sizes sorted in non-increasing order\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    char words[100000][101];\n    for (int i = 0; i < n; i++) scanf(\"%s\", words[i]);\n\n    // TODO: print the number of anagram groups, then the group sizes sorted in non-increasing order\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\neat\ntea\ntan\nate\nnat\nbat",
        "expectedOutput": "3\n3 2 1",
        "isHidden": false
      },
      {
        "input": "1\na",
        "expectedOutput": "1\n1",
        "isHidden": false
      },
      {
        "input": "3\nabc\ncba\nbca",
        "expectedOutput": "1\n3",
        "isHidden": true
      },
      {
        "input": "4\nabcd\nbcda\ndcba\nwxyz",
        "expectedOutput": "2\n3 1",
        "isHidden": true
      },
      {
        "input": "2\naa\naa",
        "expectedOutput": "1\n2",
        "isHidden": true
      }
    ],
    "hints": [
      "Two strings are anagrams if and only if they become identical after sorting their characters.",
      "Use a hash map keyed by each string's sorted-character form, counting how many strings map to each key.",
      "Once you have the counts per group, sort just the counts (not the strings) in non-increasing order to produce the output."
    ],
    "editorial": "For each string, compute a canonical form by sorting its characters (two strings are anagrams exactly when their sorted forms are identical). Use a hash map from canonical form to a running count, incrementing it for every string. After processing all n strings, the hash map's values are the group sizes; sort them in non-increasing order and print the count of groups followed by the sorted sizes. Sorting each string of length L costs O(L log L), so the total time is O(n * L log L + n log n) for the final sort of group sizes."
  },
  {
    "title": "Redundant Connection",
    "slug": "redundant-connection",
    "difficulty": "Medium",
    "topics": [
      "Graph",
      "Union-Find"
    ],
    "statement": "You are given a graph with n nodes (labeled 1 to n) that started out as a tree (n nodes, n-1 edges) and then had exactly one extra edge added, for n edges total, creating exactly one cycle. The edges are listed in the order they were originally added. Find the edge that, when processed in this order using Union-Find, connects two nodes that are already in the same connected component — that is the edge that created the cycle. It is guaranteed that exactly one such edge exists.",
    "inputFormat": "Line 1: n (number of nodes, equal to the number of edges)\nNext n lines: u v (an edge between nodes u and v, 1-indexed)",
    "outputFormat": "The redundant edge as two space-separated integers: u v",
    "constraints": "3 <= n <= 100000, 1 <= u, v <= n",
    "examples": [
      {
        "input": "3\n1 2\n1 3\n2 3",
        "output": "2 3",
        "explanation": "Edges 1-2 and 1-3 connect all three nodes; edge 2-3 connects two nodes already in the same component."
      },
      {
        "input": "4\n1 2\n2 3\n3 4\n1 4",
        "output": "1 4",
        "explanation": "The first three edges form a chain connecting all nodes; edge 1-4 closes the cycle."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nedges = [tuple(map(int, input().split())) for _ in range(n)]\n\n# TODO: print the edge (u v) that creates a cycle when processed with Union-Find\ndef solve(n, edges):\n    pass\n\nresult = solve(n, edges)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst edges = [];\nfor (let i = 0; i < n; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the edge (u v) that creates a cycle when processed with Union-Find\nfunction solve(n, edges) {\n\n}\n\nsolve(n, edges);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[][] edges = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            String[] parts = sc.nextLine().trim().split(\" \");\n            edges[i][0] = Integer.parseInt(parts[0]);\n            edges[i][1] = Integer.parseInt(parts[1]);\n        }\n\n        // TODO: print the edge (u v) that creates a cycle when processed with Union-Find\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<pair<int,int>> edges(n);\n    for (int i = 0; i < n; i++) cin >> edges[i].first >> edges[i].second;\n\n    // TODO: print the edge (u v) that creates a cycle when processed with Union-Find\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int u[100000], v[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &u[i], &v[i]);\n\n    // TODO: print the edge (u v) that creates a cycle when processed with Union-Find\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "3\n1 2\n1 3\n2 3",
        "expectedOutput": "2 3",
        "isHidden": false
      },
      {
        "input": "4\n1 2\n2 3\n3 4\n1 4",
        "expectedOutput": "1 4",
        "isHidden": false
      },
      {
        "input": "5\n1 2\n1 3\n3 4\n1 4\n1 5",
        "expectedOutput": "1 4",
        "isHidden": true
      },
      {
        "input": "3\n1 2\n2 3\n1 3",
        "expectedOutput": "1 3",
        "isHidden": true
      },
      {
        "input": "6\n1 2\n2 3\n3 4\n4 5\n5 6\n2 6",
        "expectedOutput": "2 6",
        "isHidden": true
      }
    ],
    "hints": [
      "This is a classic Union-Find (Disjoint Set Union) problem.",
      "Process the edges in the given order; for each edge, check if its two endpoints are already in the same set before union-ing them.",
      "The first edge whose two endpoints are already connected (find(u) == find(v)) is the answer — since exactly one redundant edge is guaranteed, you can stop there."
    ],
    "editorial": "Maintain a Disjoint Set Union (Union-Find) structure over the n nodes, initialized with each node in its own set. Process the edges in the given order: for each edge (u, v), find the representative of u's set and v's set; if they are already the same, this edge connects two nodes already reachable from each other, so it is the redundant edge that created the cycle — print it and stop. Otherwise, union the two sets and continue. With path compression and union by rank, each find/union operation runs in nearly O(1) amortized time, giving an overall O(n * alpha(n)) algorithm, where alpha is the inverse Ackermann function."
  },
  {
    "title": "Min Stack Operations",
    "slug": "min-stack-operations",
    "difficulty": "Medium",
    "topics": [
      "Stack"
    ],
    "statement": "Simulate a stack that supports retrieving its minimum element in O(1) time, alongside the usual push and pop. Process q operations of the following types: \"push x\" (push x onto the stack), \"pop\" (remove the top element), \"top\" (print the top element without removing it), and \"getMin\" (print the current minimum element in the stack). It is guaranteed that pop, top, and getMin are never called on an empty stack.",
    "inputFormat": "Line 1: q\nNext q lines: an operation, one of \"push x\", \"pop\", \"top\", or \"getMin\"",
    "outputFormat": "For every \"top\" or \"getMin\" operation, print the result on its own line, in the order the operations occur",
    "constraints": "1 <= q <= 100000, -1000000000 <= x <= 1000000000",
    "examples": [
      {
        "input": "6\npush 5\npush 3\ngetMin\npush 7\ntop\ngetMin",
        "output": "3\n7\n3",
        "explanation": "After pushing 5, 3: min is 3. After pushing 7: top is 7, min is still 3."
      },
      {
        "input": "7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin",
        "output": "-3\n0\n-2",
        "explanation": "Min after pushing -2,0,-3 is -3. Popping removes -3, leaving [-2,0]; top is 0, min is -2."
      }
    ],
    "starterCode": {
      "python": "import sys\nlines = sys.stdin.read().split('\\n')\nq = int(lines[0])\nops = lines[1:1 + q]\n\n# TODO: simulate the stack; for each \"top\" or \"getMin\" op, print the result on its own line\ndef solve(ops):\n    pass\n\nresult = solve(ops)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst q = parseInt(lines[0]);\nconst ops = lines.slice(1, 1 + q);\n\n// TODO: simulate the stack; for each \"top\" or \"getMin\" op, print the result on its own line\nfunction solve(ops) {\n\n}\n\nsolve(ops);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int q = Integer.parseInt(sc.nextLine().trim());\n        String[] ops = new String[q];\n        for (int i = 0; i < q; i++) ops[i] = sc.nextLine();\n\n        // TODO: simulate the stack; for each \"top\" or \"getMin\" op, print the result on its own line\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int q; cin >> q;\n    cin.ignore();\n    vector<string> ops(q);\n    for (int i = 0; i < q; i++) getline(cin, ops[i]);\n\n    // TODO: simulate the stack; for each \"top\" or \"getMin\" op, print the result on its own line\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int q;\n    scanf(\"%d\", &q);\n    getchar();\n    char ops[100000][32];\n    for (int i = 0; i < q; i++) fgets(ops[i], sizeof(ops[i]), stdin);\n\n    // TODO: simulate the stack; for each \"top\" or \"getMin\" op, print the result on its own line\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "6\npush 5\npush 3\ngetMin\npush 7\ntop\ngetMin",
        "expectedOutput": "3\n7\n3",
        "isHidden": false
      },
      {
        "input": "7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin",
        "expectedOutput": "-3\n0\n-2",
        "isHidden": false
      },
      {
        "input": "3\npush 1\npush 1\ngetMin",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4\npush 5\npop\npush 3\ngetMin",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "5\npush 2\npush 2\npop\ngetMin\ntop",
        "expectedOutput": "2\n2",
        "isHidden": true
      }
    ],
    "hints": [
      "A single stack alone can't give you the minimum in O(1) after pops, since the minimum can change as elements are removed.",
      "Maintain a second stack that tracks the minimum seen so far at each point in time.",
      "Each time you push x onto the main stack, also push min(x, current minimum) onto the auxiliary min-stack; pop both stacks together."
    ],
    "editorial": "Maintain two stacks in parallel: the main stack holding the actual values, and an auxiliary min-stack where the value at each position is the minimum of all elements pushed onto the main stack up to that point. On push x, push x onto the main stack and push min(x, min-stack's current top, or x if the min-stack is empty) onto the min-stack. On pop, pop both stacks together. \"top\" reads the main stack's top and \"getMin\" reads the min-stack's top, both in O(1). This uses O(n) extra space for the auxiliary stack but gives O(1) time for every operation, which a naive approach recomputing the minimum on every getMin call (O(n) per call) cannot achieve."
  },
  {
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Two Pointers",
      "Greedy"
    ],
    "statement": "You are given n non-negative integers, where the i-th value represents the height of a vertical line drawn at position i. Find two lines that, together with the x-axis, form a container that holds the most water, and print the maximum amount of water it can store. The amount of water held by lines at positions i and j (i < j) is min(height[i], height[j]) * (j - i).",
    "inputFormat": "Line 1: n\nLine 2: n space-separated integers, the heights",
    "outputFormat": "A single integer: the maximum amount of water that can be contained",
    "constraints": "2 <= n <= 100000, 0 <= height[i] <= 100000",
    "examples": [
      {
        "input": "9\n1 8 6 2 5 4 8 3 7",
        "output": "49",
        "explanation": "Lines at indices 1 and 8 (heights 8 and 7) give min(8,7)*(8-1) = 49."
      },
      {
        "input": "2\n1 1",
        "output": "1",
        "explanation": "Only one pair possible: min(1,1)*(1-0) = 1."
      }
    ],
    "starterCode": {
      "python": "n = int(input())\nheight = list(map(int, input().split()))\n\n# TODO: print the maximum water that can be contained between two lines\ndef solve(height):\n    pass\n\nresult = solve(height)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst height = lines[1].trim().split(' ').map(Number);\n\n// TODO: print the maximum water that can be contained between two lines\nfunction solve(height) {\n\n}\n\nsolve(height);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        int[] height = Arrays.stream(sc.nextLine().trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n\n        // TODO: print the maximum water that can be contained between two lines\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> height(n);\n    for (int i = 0; i < n; i++) cin >> height[i];\n\n    // TODO: print the maximum water that can be contained between two lines\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long height[100000];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &height[i]);\n\n    // TODO: print the maximum water that can be contained between two lines\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "9\n1 8 6 2 5 4 8 3 7",
        "expectedOutput": "49",
        "isHidden": false
      },
      {
        "input": "2\n1 1",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "5\n4 3 2 1 4",
        "expectedOutput": "16",
        "isHidden": true
      },
      {
        "input": "4\n1 2 4 3",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "3\n0 5 0",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "Checking every pair of lines is O(n^2) — too slow for n up to 100000.",
      "Start with two pointers at the extreme ends of the array; the width is maximized there, so any improvement must come from a taller line.",
      "At each step, move the pointer at the shorter line inward — moving the taller line's pointer can never increase the area, since width only shrinks and height is capped by the shorter side."
    ],
    "editorial": "Use two pointers starting at the leftmost and rightmost indices. At each step compute the area formed by the two pointers and update the best answer, then move whichever pointer points to the shorter line inward. This greedy move is safe because the container's height is always limited by the shorter of the two lines: keeping the shorter line in place and moving the taller line's pointer inward can only decrease the width while the limiting height stays the same or gets worse, so it can never produce a better answer — only moving the shorter line's pointer has a chance of finding a taller line that increases the area. This runs in O(n) time with O(1) extra space, versus the O(n^2) brute-force approach of checking every pair."
  },
  {
    "title": "Course Schedule (Cycle Detection)",
    "slug": "course-schedule-cycle-detection",
    "difficulty": "Medium",
    "topics": [
      "Graph",
      "Topological Sort",
      "BFS"
    ],
    "statement": "There are n courses labeled 0 to n-1 and m prerequisite pairs. Each pair (a, b) means course b must be completed before course a. Determine whether it is possible to finish all n courses, i.e. whether the prerequisite graph (a directed edge from b to a for every pair) contains no cycle. Print \"true\" if all courses can be finished, otherwise \"false\".",
    "inputFormat": "Line 1: n m\nNext m lines: a b (course a requires course b as a prerequisite)",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= n <= 100000, 0 <= m <= 200000, 0 <= a, b < n",
    "examples": [
      {
        "input": "2 1\n1 0",
        "output": "true",
        "explanation": "Take course 0, then course 1. No cycle."
      },
      {
        "input": "2 2\n1 0\n0 1",
        "output": "false",
        "explanation": "Course 0 requires course 1 and course 1 requires course 0 — a cycle, impossible to finish."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# TODO: print \"true\" if all n courses can be finished (no cycle in the prerequisite graph), else \"false\"\ndef solve(n, edges):\n    pass\n\nresult = solve(n, edges)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print \"true\" if all n courses can be finished (no cycle in the prerequisite graph), else \"false\"\nfunction solve(n, edges) {\n\n}\n\nsolve(n, edges);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n        }\n\n        // TODO: print \"true\" if all n courses can be finished (no cycle in the prerequisite graph), else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<pair<int,int>> edges(m);\n    for (int i = 0; i < m; i++) cin >> edges[i].first >> edges[i].second;\n\n    // TODO: print \"true\" if all n courses can be finished (no cycle in the prerequisite graph), else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int a[200000], b[200000];\n    for (int i = 0; i < m; i++) scanf(\"%d %d\", &a[i], &b[i]);\n\n    // TODO: print \"true\" if all n courses can be finished (no cycle in the prerequisite graph), else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2 1\n1 0",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "2 2\n1 0\n0 1",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "4 4\n1 0\n2 0\n3 1\n3 2",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "3 3\n0 1\n1 2\n2 0",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "3 0",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "Model the prerequisites as a directed graph: an edge from b to a for every pair (a, b), since b must come before a.",
      "You can finish all courses if and only if this directed graph has no cycle.",
      "Use Kahn's algorithm: repeatedly remove nodes with in-degree 0; if you can remove all n nodes this way, there's no cycle, otherwise a cycle remains among the unremoved nodes."
    ],
    "editorial": "Build a directed graph with an edge from b to a for every prerequisite pair (a, b), and compute the in-degree of every node. Use Kahn's algorithm (BFS-based topological sort): start with all nodes of in-degree 0 in a queue, repeatedly pop a node, count it as processed, and decrement the in-degree of its neighbors, pushing any that drop to 0. If the total number of processed nodes equals n at the end, the graph is acyclic and all courses can be finished; otherwise some nodes remain stuck with positive in-degree, meaning they are part of a cycle and it's impossible to finish all courses. This runs in O(n + m) time."
  },
  {
    "title": "Word Break",
    "slug": "word-break",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming",
      "Strings",
      "Hash Map"
    ],
    "statement": "Given a string s and a dictionary of n words, determine whether s can be segmented into a space-separated sequence of one or more dictionary words. The same dictionary word may be reused any number of times. Print \"true\" or \"false\".",
    "inputFormat": "Line 1: s\nLine 2: n (number of dictionary words)\nLine 3: n space-separated dictionary words",
    "outputFormat": "\"true\" or \"false\"",
    "constraints": "1 <= length of s <= 1000, 1 <= n <= 1000, 1 <= length of each word <= 50, all strings consist of lowercase letters",
    "examples": [
      {
        "input": "leetcode\n2\nleet code",
        "output": "true",
        "explanation": "\"leetcode\" can be segmented as \"leet code\"."
      },
      {
        "input": "catsandog\n5\ncats dog sand and cat",
        "output": "false",
        "explanation": "No combination of the dictionary words reconstructs \"catsandog\"."
      }
    ],
    "starterCode": {
      "python": "s = input().strip()\nn = int(input())\nwords = input().split()\n\n# TODO: print \"true\" if s can be segmented into dictionary words (reuse allowed), else \"false\"\ndef solve(s, words):\n    pass\n\nresult = solve(s, words)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst s = lines[0].trim();\nconst n = parseInt(lines[1]);\nconst words = lines[2].trim().split(' ');\n\n// TODO: print \"true\" if s can be segmented into dictionary words (reuse allowed), else \"false\"\nfunction solve(s, words) {\n\n}\n\nsolve(s, words);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        int n = Integer.parseInt(sc.nextLine().trim());\n        String[] words = sc.nextLine().trim().split(\" \");\n\n        // TODO: print \"true\" if s can be segmented into dictionary words (reuse allowed), else \"false\"\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int n; cin >> n;\n    vector<string> words(n);\n    for (int i = 0; i < n; i++) cin >> words[i];\n\n    // TODO: print \"true\" if s can be segmented into dictionary words (reuse allowed), else \"false\"\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1001];\n    scanf(\"%s\", s);\n    int n;\n    scanf(\"%d\", &n);\n    char words[1000][51];\n    for (int i = 0; i < n; i++) scanf(\"%s\", words[i]);\n\n    // TODO: print \"true\" if s can be segmented into dictionary words (reuse allowed), else \"false\"\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "leetcode\n2\nleet code",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "catsandog\n5\ncats dog sand and cat",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "applepenapple\n2\napple pen",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "a\n1\nb",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "aaaaaaa\n2\na aa",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "Try defining dp[i] as whether the prefix s[0..i) can be fully segmented into dictionary words.",
      "dp[0] is true (the empty prefix is trivially segmentable); for i > 0, dp[i] is true if there's some j < i with dp[j] true and s[j..i) is a dictionary word.",
      "Put the dictionary words in a hash set for O(1) lookup, and for each i try every possible j to check the substring."
    ],
    "editorial": "Use dynamic programming where dp[i] represents whether the prefix s[0..i) can be segmented entirely into dictionary words. Set dp[0] = true as the base case. For each i from 1 to the length of s, check every j from 0 to i-1: if dp[j] is true and the substring s[j..i) exists in the dictionary (stored in a hash set for O(1) lookup), then dp[i] is true. The final answer is dp[length of s]. This runs in O(n^2) time (n being the length of s, with O(1) substring lookup amortized via hashing, though actual substring extraction costs add a further factor), which is efficient enough given n up to 1000."
  },
  {
    "title": "Edit Distance",
    "slug": "edit-distance",
    "difficulty": "Hard",
    "topics": [
      "Dynamic Programming",
      "Strings"
    ],
    "statement": "Given two strings word1 and word2, find the minimum number of operations required to convert word1 into word2. You may insert a character, delete a character, or replace a character, each counting as one operation.",
    "inputFormat": "Line 1: word1\nLine 2: word2",
    "outputFormat": "A single integer: the minimum edit distance between word1 and word2",
    "constraints": "1 <= length of word1, word2 <= 1000, lowercase letters only",
    "examples": [
      {
        "input": "horse\nros",
        "output": "3",
        "explanation": "horse -> rorse (replace h with r) -> rose (remove r) -> ros (remove e)."
      },
      {
        "input": "intention\nexecution",
        "output": "5",
        "explanation": "Five operations are needed to transform \"intention\" into \"execution\"."
      }
    ],
    "starterCode": {
      "python": "word1 = input().strip()\nword2 = input().strip()\n\n# TODO: print the minimum edit distance (insert/delete/replace) between word1 and word2\ndef solve(word1, word2):\n    pass\n\nresult = solve(word1, word2)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst word1 = lines[0].trim();\nconst word2 = lines[1].trim();\n\n// TODO: print the minimum edit distance (insert/delete/replace) between word1 and word2\nfunction solve(word1, word2) {\n\n}\n\nsolve(word1, word2);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String word1 = sc.nextLine().trim();\n        String word2 = sc.nextLine().trim();\n\n        // TODO: print the minimum edit distance (insert/delete/replace) between word1 and word2\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string word1, word2;\n    cin >> word1 >> word2;\n\n    // TODO: print the minimum edit distance (insert/delete/replace) between word1 and word2\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char word1[1001], word2[1001];\n    scanf(\"%s %s\", word1, word2);\n\n    // TODO: print the minimum edit distance (insert/delete/replace) between word1 and word2\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "horse\nros",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "intention\nexecution",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "abc\nabc",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "a\nb",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "kitten\nsitting",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "hints": [
      "Define dp[i][j] as the minimum number of operations to convert the first i characters of word1 into the first j characters of word2.",
      "If the last characters match, no operation is needed there: dp[i][j] = dp[i-1][j-1].",
      "If they don't match, take 1 plus the best of the three options: replace (dp[i-1][j-1]), delete from word1 (dp[i-1][j]), or insert into word1 (dp[i][j-1])."
    ],
    "editorial": "Build a 2D DP table dp[i][j] representing the minimum edit distance between the first i characters of word1 and the first j characters of word2. Base cases: dp[i][0] = i (delete all i characters) and dp[0][j] = j (insert all j characters). For i, j > 0: if word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1] (no operation needed); otherwise dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]), corresponding to replace, delete, and insert respectively. The answer is dp[n][m]. This runs in O(n*m) time and space, which is efficient enough for lengths up to 1000 (the space can be reduced to O(min(n,m)) by keeping only two rows, though it isn't required here)."
  },
  {
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Hard",
    "topics": [
      "Binary Search",
      "Arrays"
    ],
    "statement": "Given two sorted (ascending) arrays nums1 of size n and nums2 of size m, find the median of the combined set of n + m numbers, in O(log(min(n, m))) time. Print the median formatted with exactly one digit after the decimal point (the median of a combined array of integers is always either a whole number or ends in exactly .5).",
    "inputFormat": "Line 1: n m\nLine 2: n space-separated integers (nums1, sorted ascending)\nLine 3: m space-separated integers (nums2, sorted ascending)",
    "outputFormat": "The median, printed with exactly one digit after the decimal point",
    "constraints": "1 <= n, m <= 100000, all elements fit in a 32-bit integer",
    "examples": [
      {
        "input": "2 1\n1 3\n2",
        "output": "2.0",
        "explanation": "Combined sorted array is [1,2,3], median is 2."
      },
      {
        "input": "2 2\n1 2\n3 4",
        "output": "2.5",
        "explanation": "Combined sorted array is [1,2,3,4], median is (2+3)/2 = 2.5."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nnums1 = list(map(int, input().split()))\nnums2 = list(map(int, input().split()))\n\n# TODO: print the median of the two combined sorted arrays, with exactly one decimal digit\ndef solve(nums1, nums2):\n    pass\n\nresult = solve(nums1, nums2)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst nums1 = lines[1].trim().split(' ').map(Number);\nconst nums2 = lines[2].trim().split(' ').map(Number);\n\n// TODO: print the median of the two combined sorted arrays, with exactly one decimal digit\nfunction solve(nums1, nums2) {\n\n}\n\nsolve(nums1, nums2);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[] nums1 = new int[n];\n        for (int i = 0; i < n; i++) nums1[i] = sc.nextInt();\n        int[] nums2 = new int[m];\n        for (int i = 0; i < m; i++) nums2[i] = sc.nextInt();\n\n        // TODO: print the median of the two combined sorted arrays, with exactly one decimal digit\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<int> nums1(n), nums2(m);\n    for (int i = 0; i < n; i++) cin >> nums1[i];\n    for (int i = 0; i < m; i++) cin >> nums2[i];\n\n    // TODO: print the median of the two combined sorted arrays, with exactly one decimal digit\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int nums1[100000], nums2[100000];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &nums1[i]);\n    for (int i = 0; i < m; i++) scanf(\"%d\", &nums2[i]);\n\n    // TODO: print the median of the two combined sorted arrays, with exactly one decimal digit\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2 1\n1 3\n2",
        "expectedOutput": "2.0",
        "isHidden": false
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "2.5",
        "isHidden": false
      },
      {
        "input": "1 1\n1\n1",
        "expectedOutput": "1.0",
        "isHidden": true
      },
      {
        "input": "3 5\n1 2 3\n4 5 6 7 8",
        "expectedOutput": "4.5",
        "isHidden": true
      },
      {
        "input": "1 1\n-5\n5",
        "expectedOutput": "0.0",
        "isHidden": true
      }
    ],
    "hints": [
      "Merging both arrays and sorting gives an O((n+m) log(n+m)) solution, but the O(log(min(n,m))) target requires a smarter partition-based approach.",
      "Binary search over the smaller array to choose a partition point; the corresponding partition point in the other array is determined by the total left-half size needed.",
      "A partition is correct when every element on the left side of both arrays is less than or equal to every element on the right side; adjust the binary search based on which side's boundary values violate this."
    ],
    "editorial": "Binary search on the smaller array (say nums1, size n <= m) to find a partition index i, splitting nums1 into a left part of i elements and a right part of n-i elements. The corresponding partition index j in nums2 is forced by requiring the combined left part to have exactly (n+m+1)/2 elements: j = (n+m+1)/2 - i. The partition is valid when nums1[i-1] <= nums2[j] and nums2[j-1] <= nums1[i] (treating out-of-range accesses as -infinity/+infinity). If nums1[i-1] > nums2[j], i is too large, so binary search moves left; otherwise it moves right. Once a valid partition is found, the median is either the maximum of the left parts (if n+m is odd) or the average of the maximum of the left parts and the minimum of the right parts (if n+m is even). Binary searching over the smaller array bounds the search space to O(log(min(n,m))), which is the key to beating the straightforward O(n+m) merge approach."
  },
  {
    "title": "Minimum Spanning Tree (Kruskal's Algorithm)",
    "slug": "minimum-spanning-tree-kruskal",
    "difficulty": "Hard",
    "topics": [
      "Graph",
      "Union-Find",
      "Greedy"
    ],
    "statement": "Given a connected, undirected, weighted graph with n nodes (0-indexed) and m edges, find the total weight of its minimum spanning tree (MST) — the subset of n-1 edges connecting all nodes with the smallest possible total edge weight.",
    "inputFormat": "Line 1: n m\nNext m lines: u v w (an edge between u and v with weight w)",
    "outputFormat": "A single integer: the total weight of the minimum spanning tree",
    "constraints": "1 <= n <= 100000, n-1 <= m <= 200000, the graph is guaranteed connected, 0 <= u, v < n, 1 <= w <= 100000",
    "examples": [
      {
        "input": "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        "output": "19",
        "explanation": "The MST uses edges (2,3,4), (0,3,5), and (0,1,10), totaling 4+5+10=19."
      },
      {
        "input": "3 3\n0 1 1\n1 2 2\n0 2 3",
        "output": "3",
        "explanation": "The MST uses edges (0,1,1) and (1,2,2), totaling 3."
      }
    ],
    "starterCode": {
      "python": "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# TODO: print the total weight of the minimum spanning tree, using Kruskal's algorithm\ndef solve(n, edges):\n    pass\n\nresult = solve(n, edges)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [n, m] = lines[0].trim().split(' ').map(Number);\nconst edges = [];\nfor (let i = 0; i < m; i++) edges.push(lines[1 + i].trim().split(' ').map(Number));\n\n// TODO: print the total weight of the minimum spanning tree, using Kruskal's algorithm\nfunction solve(n, edges) {\n\n}\n\nsolve(n, edges);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[][] edges = new int[m][3];\n        for (int i = 0; i < m; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n            edges[i][2] = sc.nextInt();\n        }\n\n        // TODO: print the total weight of the minimum spanning tree, using Kruskal's algorithm\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<array<int,3>> edges(m);\n    for (int i = 0; i < m; i++) cin >> edges[i][0] >> edges[i][1] >> edges[i][2];\n\n    // TODO: print the total weight of the minimum spanning tree, using Kruskal's algorithm\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int u[200000], v[200000], w[200000];\n    for (int i = 0; i < m; i++) scanf(\"%d %d %d\", &u[i], &v[i], &w[i]);\n\n    // TODO: print the total weight of the minimum spanning tree, using Kruskal's algorithm\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        "expectedOutput": "19",
        "isHidden": false
      },
      {
        "input": "3 3\n0 1 1\n1 2 2\n0 2 3",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "5 6\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7",
        "expectedOutput": "16",
        "isHidden": true
      },
      {
        "input": "1 0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "3 3\n0 1 5\n0 1 2\n1 2 3",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "hints": [
      "Kruskal's algorithm builds the MST by considering edges in increasing order of weight.",
      "Sort all m edges by weight, then use Union-Find to greedily add each edge that connects two different components.",
      "Stop early once n-1 edges have been added — the tree is complete and adding more edges would only create cycles."
    ],
    "editorial": "Kruskal's algorithm sorts all edges by weight in ascending order, then greedily processes them: for each edge, use Union-Find to check whether its two endpoints are already in the same connected component; if not, add the edge to the MST (union the components and add its weight to the running total), otherwise skip it since it would form a cycle. This greedy strategy is correct by the cut property of MSTs: the lightest edge crossing any cut of the graph must be part of some MST. The algorithm can stop once n-1 edges have been added, since the tree is then complete. Sorting the edges takes O(m log m), and the Union-Find operations take nearly O(m) with path compression and union by rank, giving an overall O(m log m) algorithm."
  },
  {
    "title": "LRU Cache Simulation",
    "slug": "lru-cache-operations",
    "difficulty": "Hard",
    "topics": [
      "Hash Map",
      "Linked List",
      "Design"
    ],
    "statement": "Design and simulate a Least Recently Used (LRU) cache with a fixed capacity. It supports two operations, processed in order: \"put x y\" inserts or updates the value y for key x — if this insertion would exceed the cache's capacity, evict the least recently used key first; and \"get x\" returns the value for key x if present, or -1 if not. Accessing a key via either \"get\" or \"put\" marks it as the most recently used.",
    "inputFormat": "Line 1: capacity q\nNext q lines: an operation, either \"put x y\" or \"get x\"",
    "outputFormat": "For every \"get\" operation, print the result on its own line, in the order the operations occur",
    "constraints": "1 <= capacity <= 100000, 1 <= q <= 200000, 0 <= x, y <= 1000000000",
    "examples": [
      {
        "input": "2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
        "output": "1\n-1\n-1\n3\n4",
        "explanation": "Capacity 2: after put 3, key 2 (least recently used) is evicted; after put 4, key 1 (least recently used at that point) is evicted."
      },
      {
        "input": "1 5\nput 1 10\nget 1\nput 2 20\nget 1\nget 2",
        "output": "10\n-1\n20",
        "explanation": "Capacity 1: putting key 2 evicts key 1 since the cache can hold only one entry."
      }
    ],
    "starterCode": {
      "python": "import sys\nlines = sys.stdin.read().split('\\n')\ncapacity, q = map(int, lines[0].split())\nops = lines[1:1 + q]\n\n# TODO: simulate an LRU cache of the given capacity; for each \"get\", print the result on its own line\ndef solve(capacity, ops):\n    pass\n\nresult = solve(capacity, ops)\n",
      "javascript": "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst [capacity, q] = lines[0].trim().split(' ').map(Number);\nconst ops = lines.slice(1, 1 + q);\n\n// TODO: simulate an LRU cache of the given capacity; for each \"get\", print the result on its own line\nfunction solve(capacity, ops) {\n\n}\n\nsolve(capacity, ops);\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int capacity = sc.nextInt();\n        int q = sc.nextInt();\n        sc.nextLine();\n        String[] ops = new String[q];\n        for (int i = 0; i < q; i++) ops[i] = sc.nextLine();\n\n        // TODO: simulate an LRU cache of the given capacity; for each \"get\", print the result on its own line\n    }\n}\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int capacity, q; cin >> capacity >> q;\n    cin.ignore();\n    vector<string> ops(q);\n    for (int i = 0; i < q; i++) getline(cin, ops[i]);\n\n    // TODO: simulate an LRU cache of the given capacity; for each \"get\", print the result on its own line\n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int capacity, q;\n    scanf(\"%d %d\", &capacity, &q);\n    getchar();\n    char ops[200000][32];\n    for (int i = 0; i < q; i++) fgets(ops[i], sizeof(ops[i]), stdin);\n\n    // TODO: simulate an LRU cache of the given capacity; for each \"get\", print the result on its own line\n\n    return 0;\n}\n"
    },
    "testCases": [
      {
        "input": "2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
        "expectedOutput": "1\n-1\n-1\n3\n4",
        "isHidden": false
      },
      {
        "input": "1 5\nput 1 10\nget 1\nput 2 20\nget 1\nget 2",
        "expectedOutput": "10\n-1\n20",
        "isHidden": false
      },
      {
        "input": "2 3\nput 1 1\nput 1 2\nget 1",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "3 7\nput 1 1\nput 2 2\nput 3 3\nget 1\nput 4 4\nget 2\nget 3",
        "expectedOutput": "1\n-1\n3",
        "isHidden": true
      },
      {
        "input": "1 5\nget 1\nput 1 100\nget 1\nput 1 200\nget 1",
        "expectedOutput": "-1\n100\n200",
        "isHidden": true
      }
    ],
    "hints": [
      "A plain hash map can look up values in O(1) but doesn't track usage order, so you also need a structure to track which key was used least recently.",
      "Combine a hash map (key to value, and key to a node reference) with a doubly linked list ordered from least to most recently used.",
      "On every access (get or put), move that key's node to the most-recently-used end of the list; on capacity overflow, evict the node at the least-recently-used end and remove it from the hash map too."
    ],
    "editorial": "Combine a hash map from key to a doubly linked list node with a doubly linked list that keeps nodes ordered from least recently used (near the head) to most recently used (near the tail). For \"get x\": if x is in the hash map, unlink its node and reinsert it at the tail (marking it most recently used), and return its value; otherwise return -1. For \"put x y\": if x already exists, update its value and move its node to the tail; otherwise, if the cache is at capacity, remove the node at the head (the least recently used) from both the list and the hash map, then insert a new node for x at the tail. Because a doubly linked list allows O(1) removal and insertion given a node reference, and the hash map gives O(1) lookup of that reference, every operation runs in O(1) time, which a simpler approach (like a list scanned linearly for recency) cannot achieve for large q."
  }
];
