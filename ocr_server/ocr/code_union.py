import re
import string

def get_startspace(str):
    n = 0
    for c in str:
        if(c.isalpha() == False):
            n += 1
        else: break
    return n

def compare_start_space(str1, str2):
    n1 = get_startspace(str1)
    n2 = get_startspace(str2)

    return abs(n1-n2)

def compare_brackets_num(str1, str2):
    brackets = ['<','>','[',']','(',')','{','}']
    dic = {x:[0,0] for x in brackets}
    for c in str1:
        if c in dic: dic[c][0] += 1

    for c in str2:
        if c in dic: dic[c][1] += 1

    result = 0
    for k in dic:
        c1, c2 = dic[k]
        result += abs(c1-c2)
    return result


def compare_alphabets_num(str1, str2):
    alphabets = list(string.printable)
    dic = {x:[0,0] for x in alphabets}
    for c in str1:
        if c in dic: dic[c][0] += 1

    for c in str2:
        if c in dic: dic[c][1] += 1

    result = 0
    for k in dic:
        c1, c2 = dic[k]
        result += abs(c1-c2)
    return result


def get_substr(str1, str2):
    len_t = len(str1)
    len_c = len(str2)
    result = ''

    for i in range(len_t):
        for j in range(len_c):
            lcs_temp = 0
            match = ''

            while ((i + lcs_temp < len_t) and (j + lcs_temp < len_c) and (str1[i + lcs_temp] == str2[j + lcs_temp])):
                match += str2[j + lcs_temp]
                lcs_temp += 1
            if len(match) > len(result):
                result = match

    return result


def get_LCS(str1, str2):
    len1 = len(str1)
    len2 = len(str2)
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    result = ''

    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            if str1[i - 1] == str2[j - 1]:
                matrix[i][j] = matrix[i - 1][j - 1] + 1
            else:
                matrix[i][j] = max(matrix[i - 1][j], matrix[i][j - 1])

    i = len1
    j = len2
    while(i>0 and j>0):
        if str1[i - 1] == str2[j - 1]:
            result = str1[i - 1] + result
            i-=1
            j-=1
        elif matrix[i-1][j] > matrix[i][j-1]:
            i-=1
        else:
            j-=1

    return result

def reservedset():
    return set(['asm', 'double', 'new',	'switch', 'auto', 'else', 'operator', 'template',  
    'break', 'enum', 'private', 'this', 'case', 'extern', 'protected', 'throw', 'catch', 'float', 
    'public', 'try', 'char', 'for', 'register', 'typedef', 'class', 'friend', 'return', 'union', 
    'const', 'goto', 'short', 'unsigned', 'continue', 'if', 'signed', 'virtual', 'default', 'length',
    'inline', 'sizeof', 'void', 'delete', 'int', 'static', 'volatile', 'do', 'long', 'struct', 'while', 
    '++', '--', '+=', '-=', '—=', '*=', '/=', '<=', '=>', '==', '!=', 'cin', 'cout','compare', 'length', 
    'swap', 'substr', 'size', 'resize', 'replace', 'append', 'at', 'find', 'find_first_of', 'find_first_not_of',
    'find_last_of', 'find_last_not_of', 'insert', 'max_size', 'push_back', 'pop_back', 'assign', 'copy', 'back', 
    'begin', 'capacity', 'cbegin', 'cend', 'clear', 'crbegin', 'data', 'empty', 'erase', 'front', '', 'operator=', 
    'operator[]', 'rfind', 'end', 'rend', 'shrink_to_fit', 'c_str', 'crend', 'rbegin', 'reserve', 'get_allocator',
    'include', 'auto', 'if', 'break', 'case', 'register', 'continue', 'return', 'default', 'do', 'sizeof', 'static', 
    'else', 'struct', 'switch', 'extern', 'typedef', 'union', 'for', 'goto', 'while', 'enum', 'const', 'volatile', 
    'inline', 'restrict', 'asm', 'fortran','alignas', 'alignof', 'and', 'and_eq', 'audit', 'axiom', 'bitand', 'bitor', 
    'catch', 'class', 'compl', 'concept', 'constexpr', 'const_cast', 'decltype', 'delete', 'dynamic_cast', 'explicit', 
    'export', 'final', 'friend', 'import', 'module', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'operator', 
    'or', 'or_eq', 'override', 'private', 'protected', 'public', 'reinterpret_cast', 'requires', 'static_assert', 'static_cast', 
    'template', 'this', 'thread_local', 'throw', 'try', 'typeid', 'typename', 'using', 'virtual', 'xor', 'xor_eq', 'namespace', 
    'cin', 'cout', '<<', '>>', 'False', 'def', 'if', 'raise', 'None', 'del', 'import', 'True', 'elif', 'in', 'try'])

def same_reservednum(str1, str2):
    str1 = re.sub('\s+',' ',str1)
    str1 = re.split(r'[^a-zA-Z0-9]', str1)
    str2 = re.sub('\s+',' ',str2)
    str2 = re.split(r'[^a-zA-Z0-9]', str2)

    reserved = reservedset()
    dic = {x:[0,0] for x in reserved}
    for c in str1:
        if c in dic: dic[c][0] += 1

    for c in str2:
        if c in dic: dic[c][1] += 1

    result = 0
    for k in dic:
        c1, c2 = dic[k]
        result += min(c1,c2)
    return result


def get_difference_score(str1, str2):
    #if(str1.find('return') != -1 and str2.find('return') != -1): return 0
    str1 = ' '.join(str1.split())   #공백 여러개를 한개로 바꿈
    str2 = ' '.join(str2.split())

    diff = 0
    diff += compare_start_space(str1, str2) * 2    #시작 공백 수
    diff += compare_brackets_num(str1, str2) * 2    #괄호 종류별 개수
    diff += compare_alphabets_num(str1, str2)/max(1,min(len(str1), len(str2)))   #알파벳 종류별 개수
    #diff -= same_reservednum(str1, str2) * 3

    diff += max(len(str1), len(str2)) - len(get_LCS(str1, str2))       

    #diff = diff/max(len(str1), len(str2)) * 10
    #가장 긴 common substring의 길이를 뺌

    return diff


def union_code(lines, txt):
    dic = {i:[] for i in range(len(txt))}
    match = {i:[] for i in range(len(txt))}

    #for i,text in enumerate(txt):
    #    txt[i] = correct_str(text)

    for i,text in enumerate(txt):
        for j,l in enumerate(lines):
            line = l[0]
            diff = get_difference_score(line, text)
            tmp = ''.join(text.split())
            if(len(tmp)<2): continue
            if(diff<15): dic[i].append((diff, j, line))  #조금 유사
            if(diff<4): match[i].append((diff, j, line))    #많이 유사
    
    #print(match)
    match2 = {i:-1 for i in range(len(txt))}    #확실하게 매치된 것
    for k in match:
        if(len(match[k]) == 1): match2[k] = match[k][0][1]
    #print(match2)

    trusted = set()
    for k in match2:
        if(k>0 and k<len(match2)-1):
            if(match2[k-1] == match2[k]-1 and match2[k+1] == match2[k]+1):
                trusted.add(k-1)
                trusted.add(k)      #3번연속 증가하면 trusted에 넣기
                trusted.add(k+1)
    
    #print('Trust',trusted)
    if(len(trusted)>0):
        trusted = sorted(trusted)
        cur = 0
        for k in match2:
            if(k not in trusted and k<trusted[cur]):
                if(match2[k] >= trusted[cur]):  # trusted앞에 있는데 trusted보다 크면 기각 
                    match2[k] = -1
            elif(k not in trusted and k>trusted[cur]):
                if(match2[k] <= trusted[cur]):  # trusted뒤에 있는데 trusted보다 작으면 기각
                    match2[k] = -1
            elif(k in trusted):
                cur = trusted.index(k)
        trusted = set(trusted)
    
    #print(match[0])
    #print(match2)
    for k in dic:
        # txt의 k번째 줄의 자리찾기
        candid = sorted(dic[k], key=lambda x:x[0])  #diff를 기준으로 후보 sort
        remove = []
        for c in candid:
            rm = False
            for i in range(0,k):   #앞에 매칭된 번호보다 현재번호가 작으면 기각
                if(match2[i] != -1 and match2[i]>=c[1]):
                    if(k not in trusted):
                        remove.append(c)
                        rm = True
                        break
            if(not rm):
                for i in range(k+1,len(txt)):   #뒤에 매칭된 번호보다 현재번호가 크면 기각
                    if(match2[i] != -1 and match2[i]<=c[1]):
                        if(k not in trusted):
                            remove.append(c)
                            break
        for r in remove:
            if(match2[k] == r[1]):
                match2[k] = -1
            candid.remove(r)

        if(len(candid) != 0):
            match2[k] = candid[0][1]    #후보중 가장 점수 높은 것을 매치해줌

    newlines = []
    prev = []
    last = 0
    for i in match2:
        add = True
        if(match2[i] != -1):
            newlines += lines[last:match2[i]]   #lines에서 매칭되지 않았던 것들 추가
            last = match2[i]+1

            line = lines[match2[i]][0]
            text = txt[i]
            diff = get_difference_score(line, text)

            newlines += prev    #전에 txt에서 매칭되지 않았던 것들 추가
            prev = []
            if(add):
                if(diff>4):
                    newlines.append([line, text])
                else: newlines.append([text])
        else:
            text = txt[i]
            if(len(newlines)>0) and (compare_start_space(newlines[-1][0], text)>15):
                add = False
            if(len(text.split(' '))>9 and get_reservednum(text) == 0):
                add = False
            if(add): prev.append([txt[i]])

    newlines += prev
    newlines = newlines + lines[last:]

    return newlines


def is_white_string(str):
    for c in str:
        if c != ' ':
            return False
        
    return True

def trim_split(lines):
    if len(lines[0]) == 0 or is_white_string(lines[0]):
        lines = lines[1:]
    if len(lines[-1]) == 0 or is_white_string(lines[-1]):
        lines = lines[:-1]
    return lines

def del_enough_space(lines):
    min_space = 999
    for line in lines:
        for i in line:
            temp = get_startspace(i)
            if temp < min_space:
                min_space = temp
    if min_space == 0:
        return lines
    else:
        for line in lines:
            for i in range(len(line)):
                line[i] = line[i][min_space:]
    return lines

def to_semicolon(lines):
    for line in lines:
        for i,str in enumerate(line):
            line[i] = line[i].rstrip()
            if('while' in str or 'for' in str or 'if' in str or 'def' in str) and ('break' not in str): continue
            if line[i][-1] == '.'  or line[i][-1] == ':':
                line[i] = line[i][:-1] + ';'
    return lines

def get_reservednum(str):
    reserved = reservedset()
    str = re.sub('\s+',' ',str)
    str = re.split(r'[^a-zA-Z0-9]', str)

    num = 0
    for w in reserved:
        if(w in str): 
            num += 1    
    return num
    

def rm_blank_bf_period(str, startspace_num):
    find_point = startspace_num+1
    while True:
        point1 = str.find('"')
        point2 = str.find('"', point1 + 1)
        index = str.find(' ', find_point)
        while index > point2:
            point1 = str.find('"', point2 + 1)
            point2 = str.find('"', point1 + 1)
            if point2 == -1 or point1 == -1:
                break
        if index > point1 and index < point2:
            find_point = point2
            continue
        
        if index == -1:
            break

        if str[index - 1] == '.' or str[index - 1] == ' ':
            str = str[:index ] + str[index + 1 : ]
        elif index == len(str) - 1:
            break
        elif str[index + 1] == '.' or str[index + 1] == ' ':
            str = str[:index] + str[index + 1 : ]
            find_point = startspace_num
        else:
            find_point = index+1
    return str

def make_double_equals(str, startspace_num): #괄호사이의 = 을 ==으로 변경
    find_point = startspace_num+1
    while True:
        point1 = str.find('(')
        point2 = str.find(')', point1 + 1)
        index = str.find('=', find_point)
        while index > point2:
            point1 = str.find('(', point2 + 1)
            point2 = str.find(')', point1 + 1)
            if point2 == -1 or point1 == -1:
                break
        if index > point1 and index < point2: # 괄호사이에 =이 있을 때
            if str[index - 1] == '=' or str[index + 1] == '=' or str[index - 1] == '>'or str[index - 1] == '<'or str[index - 1] == '!': 
                # 앞 또는 뒤에 =이 있으면 ==, 앞에 '<', '>', '!'가 있으면 <=, >=, != 이므로 수정 x
                pass
            else:
                str = str[:index]  + "=" + str[index:]
            find_point = index+1
            continue
        
        if index == -1 or point1 == -1 or point2 == -1: # 괄호나 '='이 없으면 끝
            break
        
        find_point = point2
    return str

def string_to_char(str):
    point2 = -1
    while True:
        point1 = str.find('"', point2 + 1)
        point2 = str.find('"', point1 + 1)
        
        if point1 == -1 or point2 == -1:
            break
        if point2 - point1 == 2: # "" 사이에 글자가 하나면
            str = str[:point1] + "'" + str[point1+1:]
            str = str[:point2] + "'" + str[point2+1:]
        
    return str

def correct_code(txt):
    reserved = 0
    for str in txt:
        reserved += get_reservednum(str)

    if(reserved == 0): return []
    
    prev_startspace = get_startspace(txt[0])
    brackets = ['[',']','(',')','{','}']
    b_stack = []
    ret = []

    for str in txt:
        newstr = '' 
        skipstr = ''
        append = True
        cur_startspace = get_startspace(str)

        brackets_like = ['|','I','l','1']
        nonblank_num = 0
        blank_num = 0
        change_brackets = -1

        skip = False
        for (idx,c) in enumerate(str):
            if(c != ' '): 
                if(nonblank_num>0 and blank_num>15): 
                    skip = True
                blank_num = 0
                nonblank_num += 1
            else: 
                blank_num += 1

            if(not skip and (len(b_stack)==0 or b_stack[-1]!='(') and c ==';'):
                str1 = ' '.join(str.split())
                if(len(str1.split(';')[1]) < 4):
                    newstr += c
                    skip = True

            if(not skip):
                if(c in brackets_like):
                    change_brackets = c

                if(c in brackets):
                    b_idx = brackets.index(c)
                    if(b_idx%2 == 1):   #close
                        if(len(b_stack)!=0 and b_stack[-1] == brackets[b_idx-1]):   #stack의 top이 open이라면 pop
                            b_stack.pop()
                        else: b_stack.append(c)
                    elif(b_idx%2 == 0):
                        b_stack.append(c)

            if(not skip): newstr+=c
            elif(c!=';' and c!=' '): skipstr+=c

        if(nonblank_num > 0):
            if(cur_startspace-prev_startspace > 8): #이전 줄과 시작이 9칸이상 차이나면 삭제
                # print('remove', newstr,'*')
                append = False
            else:
                prev_startspace = cur_startspace

        if(nonblank_num == 1 and change_brackets != -1 and append):
            if(len(b_stack)==0): continue
            top = b_stack[-1]
            idx = brackets.index(top)
            
            if(idx%2 == 0):   #open
                # print("replace",change_brackets, brackets[idx+1])
                newstr = newstr.replace(change_brackets, brackets[idx+1])     #stack의 top이 open이면 close로 바꿔줌
                b_stack.pop()
        
        newstr = rm_blank_bf_period(newstr, cur_startspace)
        newstr = make_double_equals(newstr, cur_startspace)
        newstr = string_to_char(newstr)
        start = get_startspace(newstr)
        newstr = newstr[:start] + re.sub('\s+',' ',newstr[start:])   #앞 공백 말고 다른 공백 하나로
        if(append): ret.append(newstr)
        if(len(skipstr)!=0): 
            # print('skip', skipstr)
            pass

    return ret

def remove_string(str):
    found = re.findall(r'''(?x)(?<!\\)".*?(?<!\\)"''', str)
    for f in found:
        str = str.replace(f, '')
    return str

def remove_bracket(str):
    found = re.findall(r'''(?x)(?<!\\)[\[\(].*?(?<!\\)[\]\)]''', str)
    for f in found:
        str = str.replace(f, '')
    return str

def select_startspace(line):
    select = True
    if(len(line)>1):
        line1 = [' '.join(line[0].split())]
        for str in line[1:]:
            str1 = ' '.join(str.split())
        
            if(get_difference_score(line1[0], str1)>=1):
                select = False
    else: select = False

    if(select):
        line.sort(key=lambda x : get_startspace(x))
        # print('select', int(len(line)/2), ':', line)
        return [line[int(len(line)/2)]]
    return line

def select_code(line):
    count_reserved = []
    for l in line:
        count_reserved.append((l, get_reservednum(l)))
    count_reserved = sorted(count_reserved, key=lambda x: x[1])
    max_reserved = count_reserved[0]
    ret = [max_reserved[0]]
    for i in count_reserved[1:]:
        if(i[1]>max_reserved[1]-2 and get_difference_score(max_reserved[0], i[0])>4):
            ret.append(i[0])
    return ret

def add_bracket(lines):
    left = 0
    right = 0
    for line in lines:
        if line.startswith('//'):
            # print('test')
            continue
        left +=  line.count('{')
        right += line.count('}')
    if left > right:
        for i in range(left - right):
            lines += '}'
    return lines

def make_string(lines):
    str = ''
    for line in lines:
        str += line + '\n'
    return str

def delete_code(answer):    

    res = []
    prev_space = get_startspace(answer[0][0])
    prev_line = answer[0]

    for (idx, line) in enumerate(answer):
        line = select_startspace(line)
        line = select_code(line)
        li = []

        for str in line:
            start = get_startspace(str)
            str = str[:start] + re.sub('\s+',' ',str[start:])   #앞 공백 말고 다른 공백 하나로
            
            end = str.find(';')
            if(end == -1): end = str.find(':')
            
            if(end != -1 and end != len(str)-1 and len(str)-end<5):
                str = str[:end+1]   # ;:가 있고 뒤에 5자이하라면 뒤는 무시
            delete = False

            cur_space = start
            if(cur_space - prev_space > 8): #이전 줄과 시작이 9칸이상 차이나면 삭제
                delete = True
            elif(idx > 0 and get_difference_score(prev_line[0], str) < 3):  #이전 줄과 너무 비슷하면 삭제
                delete = True
            else: 
                str1 = ' '.join(str.split())

                for x in str1:
                    if x not in string.printable:
                        delete = True
                # //로 시작하면 제거 (주석)
                if(str1.startswith('//')): delete = True
                
                # 모두 대문자면 제거 
                elif(len(re.findall(r"[{|}|a-z|0-9]", str1)) == 0):
                    delete = True
                    
                elif(len(str1)==1 and '}' in str1): #닫히는 중괄호가 전 줄보다 뒤에 있을 때
                    if(cur_space > prev_space):
                        delete = True

                # reserved word가 하나도 없고 "",괄호 안 제외했을 때 단어 6개이상이면 제거
                elif(len(str1) > 5):
                    if(get_reservednum(str1) == 0):
                        tmp = remove_bracket(str1)
                        tmp = remove_string(tmp)
                        cnt = 0
                        if(len(tmp.split()) > 5):
                            delete = True
                        for i in ['!','@','$','%','^','&','*','~','_']:
                            if i in tmp: cnt += 1
                        if(cnt>1): delete = True

                else:       # 글자수가 1~4글자인데 +,-,*,/,= 등 없으면 제거
                    check = set(['+','-','*','/','=','{','}','(',')','[',']'])
                    num = 0
                    for c in check:
                        if(c in str1): num += 1
                    if(num == 0): 
                        delete = True

            if not delete: 
                li.append(str)

            else: 
                pass

        if(len(li) != 0):
            res.append(li)
            prev_line = li
            prev_space = cur_space
    
    return res


def make_result(answer):
    res = ''
    for line in answer:
        res += line[0]+'\n'
        if(len(line) > 1):
            for str in line[1:]:
                res += '//'+str+'\n'

    return res

class code_correct:
    def __init__(self, ocr_lines):
        self.ocr_lines = ocr_lines
        self.answer = ""
    def ocr_code_union(self): # 연속 ocr한 코드를 합치는 코드.
        res = []
        for (i,lines) in enumerate(self.ocr_lines): #각 ocr결과 string을 하나씩
            temp = lines.splitlines()
            temp = trim_split(temp)
            temp = correct_code(temp)
            if i == 0: #처음에는
                for line in temp:
                    tmp = []
                    tmp.append(line)
                    res.append(tmp)
            else:
                res = union_code(res, temp)
        res = delete_code(res)
        res = del_enough_space(res)
        res = to_semicolon(res)
        temp_result = make_result(res)
        temp_result = temp_result.splitlines()
        temp_result = add_bracket(temp_result)
        self.answer = make_string(temp_result)
            
    def ocr_code_correct(self): # ocr 한장 할 때.
        res = []
        text = self.ocr_lines[0]
        txt = text.splitlines()
        txt = trim_split(txt)
        
        txt = correct_code(txt)
        for line in txt:
            tmp = []
            tmp.append(line)
            res.append(tmp)
        res = delete_code(res)
        res = del_enough_space(res)
        res = to_semicolon(res)
        temp_result = make_result(res)
        temp_result = temp_result.splitlines()
        temp_result = add_bracket(temp_result)
        self.answer = make_string(temp_result)
        
    def get_result(self):
        return self.answer

