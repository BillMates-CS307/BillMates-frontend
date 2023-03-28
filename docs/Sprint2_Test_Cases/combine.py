# import OS module
import os
 
# Get the list of all files and directories
path = "C://Users//Logan//Documents//BillMates-frontend//docs//Sprint2_Test_Cases"
dir_list = os.listdir(path)
dir_list.sort()
combined_file = open("TEST_PLAN.txt", "w")

for file in dir_list:
    if (file != 'combine.py' and file != 'TEST_PLAN.txt'):
        test_case = open(file, "r")
        combined_file.writelines(test_case.readlines())
        combined_file.write("\n")
        test_case.close()



# combined_file = open("TEST_PLAN.txt", "w")


# # Using readlines()
# file1 = open('US_1_1.txt', 'r')
# Lines = file1.readlines()

# combined_file.writelines(Lines)