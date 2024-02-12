import subprocess


def main():
    subprocess.run(["poetry", "export", "-o", "requirements.txt"])


if __name__ == "__main__":
    main()
